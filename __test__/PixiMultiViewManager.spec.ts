import * as pixi from "pixi.js";
import { Container, Ticker, type TickerCallback } from "pixi.js";
import type { Texture } from "three";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  type MockInstance,
  vi,
} from "vitest";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import type { IRenderablePixiView } from "../src/RenderablePixiView";

// autoDetectRenderer をモック化
vi.mock("pixi.js", async (importOriginal) => {
  const actual = await importOriginal<typeof pixi>();
  const mockRenderer = {
    render: vi.fn(),
    destroy: vi.fn(),
    resize: vi.fn(),
    width: 1,
    height: 1,
  };
  return {
    ...actual,
    autoDetectRenderer: vi.fn().mockResolvedValue(mockRenderer),
    WebGLRenderer: vi.fn().mockImplementation(() => mockRenderer),
  };
});

/**
 * テスト用のIRenderablePixiViewモックを作成する関数
 * @returns IRenderablePixiView
 */
const createMockRenderablePixiView = () => {
  return {
    isDisposed: false,
    canvas: document.createElement("canvas"),
    texture: { needsUpdate: false } as Texture, // needsUpdateプロパティを追加
    container: new Container(),
  } as IRenderablePixiView;
};

describe("PixiMultiViewManager", () => {
  let manager: PixiMultiViewManager;
  let ticker: Ticker;
  let mockRenderer: {
    render: Mock;
    destroy: Mock;
    resize: Mock;
    width?: number;
    height?: number;
  };

  // スパイの定義
  let autoDetectRendererSpy: {
    (options: Partial<pixi.AutoDetectOptions>): Promise<pixi.Renderer>;
    mockResolvedValue?;
  };
  let mockRendererRenderSpy: Mock<(...args: unknown[]) => unknown>;
  let mockRendererDestroySpy: Mock<(...args: unknown[]) => unknown>;
  let tickerRemoveSpy: MockInstance<
    <T = unknown>(fn: TickerCallback<T>, context?: T | undefined) => Ticker
  >;
  let tickerStartSpy: MockInstance<() => void>;

  // 非同期処理を含むためasync
  beforeEach(async () => {
    // テスト制御用のTickerインスタンスを作成
    ticker = new Ticker();
    ticker.autoStart = false; // autoStartを無効化

    // Tickerのstartメソッドをスパイ
    tickerStartSpy = vi.spyOn(ticker, "start");

    // autoDetectRenderer のモック関数を取得し、モックRendererを返すように設定
    autoDetectRendererSpy = pixi.autoDetectRenderer;
    mockRenderer = {
      // モックRendererの定義
      render: vi.fn(),
      destroy: vi.fn(),
      resize: vi.fn(),
      width: 1,
      height: 1,
    };
    autoDetectRendererSpy.mockResolvedValue(mockRenderer); // Promiseでラップして返す

    // 実際のPixiMultiViewManagerインスタンスを作成
    manager = new PixiMultiViewManager({ ticker });

    // initを呼び出し、非同期初期化を待つ
    await manager.init();
    ticker.stop();
    ticker.update(0);

    // モックRendererのメソッドのスパイを取得
    mockRendererRenderSpy = mockRenderer.render;
    mockRendererDestroySpy = mockRenderer.destroy;
    tickerRemoveSpy = vi.spyOn(ticker, "remove");
  });

  afterEach(() => {
    // 各テストの後にインスタンスを破棄
    if (manager && !manager.isDisposed) {
      manager.dispose();
    }
    ticker.destroy();

    // スパイとモックの実装をリストア
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("init starts the given ticker, so that queued views render without the caller starting it", async () => {
    // The shared manager of this suite stops its ticker after init, so this test uses its own.
    const ownTicker = new Ticker();
    ownTicker.autoStart = false;
    const ownManager = new PixiMultiViewManager({ ticker: ownTicker });

    await ownManager.init();

    expect(ownTicker.started).toBe(true);

    ownManager.dispose();
    ownTicker.destroy();
  });

  it("init requests a multiView renderer with a transparent background, so that one renderer can draw into many canvases", async () => {
    expect(autoDetectRendererSpy).toHaveBeenCalledWith(
      expect.objectContaining({ multiView: true, backgroundAlpha: 0 }),
    );
    expect(manager.renderer).toBe(mockRenderer);
  });

  it("should not re-initialize if init is called multiple times", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    tickerStartSpy.mockClear();

    await manager.init(); // 多重実行

    expect(consoleWarnSpy).toHaveBeenCalledOnce();
    expect(tickerStartSpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it("renders each queued view once per tick and flags its texture for upload, so that the view shows on the next frame", () => {
    const mockInstance1 = createMockRenderablePixiView();
    const mockInstance2 = createMockRenderablePixiView();

    manager.requestRender(mockInstance1);
    manager.requestRender(mockInstance2);

    ticker.update(1);

    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(2);
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance1.container,
      target: mockInstance1.canvas,
    });
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance2.container,
      target: mockInstance2.canvas,
    });
    expect(mockInstance1.texture.needsUpdate).toBe(true);
    expect(mockInstance2.texture.needsUpdate).toBe(true);

    ticker.update(2);
    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(2);
  });

  it("render loop should skip disposed instances", () => {
    const mockInstance1 = createMockRenderablePixiView();
    const mockInstance2 = createMockRenderablePixiView();
    mockInstance2.isDisposed = true;

    manager.requestRender(mockInstance1);
    manager.requestRender(mockInstance2);

    ticker.update(1);

    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(1);
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance1.container,
      target: mockInstance1.canvas,
    });
    expect(mockInstance1.texture.needsUpdate).toBe(true);
    expect(mockInstance2.texture.needsUpdate).toBe(false);

    ticker.update(2);
    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(1);
  });

  it("render loop should skip instances disposed before rendering", () => {
    const mockInstance = createMockRenderablePixiView();
    manager.requestRender(mockInstance);

    mockInstance.isDisposed = true;

    ticker.update(1);

    expect(mockRendererRenderSpy).not.toHaveBeenCalledWith({
      container: mockInstance.container,
      target: mockInstance.canvas,
    });
    expect(mockInstance.texture.needsUpdate).toBe(false);
  });

  it("dispose should remove ticker listener and destroy renderer", () => {
    manager.dispose();

    expect(mockRendererDestroySpy).toHaveBeenCalledOnce();

    manager.requestRender(createMockRenderablePixiView());
    ticker.update(1);
    expect(mockRendererRenderSpy).not.toHaveBeenCalled();
  });

  it("should not re-dispose if dispose is called multiple times", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    manager.dispose();

    tickerRemoveSpy.mockClear();
    mockRendererDestroySpy.mockClear();

    manager.dispose(); // 多重実行

    expect(consoleWarnSpy).toHaveBeenCalledOnce();
    expect(tickerRemoveSpy).not.toHaveBeenCalled();
    expect(mockRendererDestroySpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});
