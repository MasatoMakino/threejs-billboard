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

/**
 * Retrieves the render queue from the PixiMultiViewManager instance.
 * @param manager - The PixiMultiViewManager instance.
 * @returns The render queue as a Set of IRenderablePixiView.
 */
const getRenderQueue = (
  manager: PixiMultiViewManager,
): Set<IRenderablePixiView> => {
  // biome-ignore lint/suspicious/noExplicitAny: intentional private access in tests
  return (manager as any)._renderQueue;
};

/**
 * Retrieves the ticker instance from the PixiMultiViewManager instance.
 * @param manager - The PixiMultiViewManager instance.
 * @returns The Ticker instance.
 */
const getTicker = (manager: PixiMultiViewManager): Ticker => {
  // biome-ignore lint/suspicious/noExplicitAny: intentional private access in tests
  return (manager as any)._ticker;
};

/**
 * Retrieves the render loop function from the PixiMultiViewManager instance.
 * @param manager - The PixiMultiViewManager instance.
 * @returns The render loop function.
 */
const getRenderLoop = (manager: PixiMultiViewManager): (() => void) => {
  // biome-ignore lint/suspicious/noExplicitAny: intentional private access in tests
  return (manager as any)._renderLoop;
};

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

    // initでstartされることを検証（ただしスパイされているので実際には開始されない）
    expect(tickerStartSpy).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    // 各テストの後にインスタンスを破棄
    if (manager && !manager.isDisposed) {
      manager.dispose();
    }
    ticker.destroy();

    // スパイとモックの実装をリストア
    vi.restoreAllMocks();
  });

  it("should initialize with provided Ticker instance", () => {
    expect(manager).toBeInstanceOf(PixiMultiViewManager);
    expect(getTicker(manager)).toBe(ticker);
  });

  it("init should initialize the renderer and start the ticker", async () => {
    // autoDetectRenderer が正しい引数で呼ばれたことを確認
    expect(autoDetectRendererSpy).toHaveBeenCalledWith({
      // スパイで検証
      width: 1,
      height: 1,
      autoDensity: false,
      preference: "webgl",
      backgroundAlpha: 0.0,
      antialias: true,
      multiView: true,
    });
    expect(manager.renderer).toBe(mockRenderer); // モックRendererが設定されていることを確認
  });

  it("should not re-initialize if init is called multiple times", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    tickerStartSpy.mockClear(); // スパイをクリア

    await manager.init(); // 多重実行

    expect(consoleWarnSpy).toHaveBeenCalledOnce(); // console.warnが一度だけ呼ばれることを確認
    expect(tickerStartSpy).not.toHaveBeenCalled(); // ticker.startが再度呼ばれないことを確認
    consoleWarnSpy.mockRestore(); // スパイを元に戻す
  });

  it("render loop should not throw error when render queue is empty", () => {
    // レンダリングループを直接呼び出す
    expect(mockRendererRenderSpy).not.toHaveBeenCalled(); // レンダリングが実行されないことを確認
    expect(getRenderQueue(manager).size).toBe(0); // キューが空のままであることを確認
  });

  it("requestRender should add an instance to the render queue", () => {
    const mockInstance = createMockRenderablePixiView();
    manager.requestRender(mockInstance);
    expect(getRenderQueue(manager).has(mockInstance)).toBe(true);
  });

  it("requestRender should not add disposed instances to the render queue", () => {
    const mockInstance = createMockRenderablePixiView();
    mockInstance.isDisposed = true;
    manager.requestRender(mockInstance);
    expect(getRenderQueue(manager).has(mockInstance)).toBe(false);
  });

  it("render loop should render queued instances and clear the queue", () => {
    const mockInstance1 = createMockRenderablePixiView();
    const mockInstance2 = createMockRenderablePixiView();

    manager.requestRender(mockInstance1);
    manager.requestRender(mockInstance2);

    // レンダリングループを呼び出す
    ticker.update(1);

    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(2); // スパイで検証
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance1.container,
      target: mockInstance1.canvas,
    });
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance2.container,
      target: mockInstance2.canvas,
    });
    expect(mockInstance1.texture.needsUpdate).toBe(true); // needsUpdateがtrueになることを確認
    expect(mockInstance2.texture.needsUpdate).toBe(true); // needsUpdateがtrueになることを確認

    expect(getRenderQueue(manager).size).toBe(0);
  });

  it("render loop should render queued instances when ticker updates", () => {
    const mockInstance = createMockRenderablePixiView();
    manager.requestRender(mockInstance);

    // Tickerのupdateを手動で呼び出すことで、レンダリングループが実行されることをシミュレート
    ticker.update(1); // currentTimeは0以上の値

    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(1); // スパイで検証
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance.container,
      target: mockInstance.canvas,
    });
    expect(mockInstance.texture.needsUpdate).toBe(true); // needsUpdateがtrueになることを確認
    expect(getRenderQueue(manager).size).toBe(0);
  });

  it("render loop should skip disposed instances", () => {
    const mockInstance1 = createMockRenderablePixiView();
    const mockInstance2 = createMockRenderablePixiView();
    mockInstance2.isDisposed = true; // 2つ目のインスタンスはdisposedに設定

    manager.requestRender(mockInstance1);
    manager.requestRender(mockInstance2);

    // レンダリングループを呼び出す
    ticker.update(1);

    expect(mockRendererRenderSpy).toHaveBeenCalledTimes(1); // スパイで検証
    expect(mockRendererRenderSpy).toHaveBeenCalledWith({
      container: mockInstance1.container,
      target: mockInstance1.canvas,
    });
    expect(mockInstance1.texture.needsUpdate).toBe(true); // needsUpdateがtrueになることを確認
    expect(mockInstance2.texture.needsUpdate).toBe(false); // disposedなのでneedsUpdateはfalseのまま
    expect(getRenderQueue(manager).size).toBe(0);
  });

  it("render loop should skip instances disposed before rendering", () => {
    const mockInstance = createMockRenderablePixiView();
    manager.requestRender(mockInstance); // isDisposed: falseでキューに追加

    mockInstance.isDisposed = true; // レンダリング前にisDisposedをtrueに設定

    // レンダリングループを呼び出す
    ticker.update(1);

    expect(mockRendererRenderSpy).not.toHaveBeenCalledWith({
      // 当該インスタンスがレンダリングされないことを確認
      container: mockInstance.container,
      target: mockInstance.canvas,
    });
    expect(mockInstance.texture.needsUpdate).toBe(false); // needsUpdateがfalseのままであることを確認
    expect(getRenderQueue(manager).size).toBe(0); // キューがクリアされていることを確認
  });

  it("dispose should remove ticker listener and destroy renderer", () => {
    manager.dispose();

    expect(tickerRemoveSpy).toHaveBeenCalledWith(
      getRenderLoop(manager),
      manager,
    );
    expect(mockRendererDestroySpy).toHaveBeenCalledOnce();
    expect(getRenderQueue(manager).size).toBe(0);
  });

  it("should not re-dispose if dispose is called multiple times", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    manager.dispose(); // 初回dispose

    // 初回dispose後のスパイをクリア
    tickerRemoveSpy.mockClear();
    mockRendererDestroySpy.mockClear();

    manager.dispose(); // 多重実行

    expect(consoleWarnSpy).toHaveBeenCalledOnce(); // console.warnが一度だけ呼ばれることを確認
    expect(tickerRemoveSpy).not.toHaveBeenCalled(); // ticker.removeが再度呼ばれないことを確認
    expect(mockRendererDestroySpy).not.toHaveBeenCalled(); // mockRenderer.destroyが再度呼ばれないことを確認
    expect(getRenderQueue(manager).size).toBe(0); // renderQueueが空のままであることを確認
    consoleWarnSpy.mockRestore(); // スパイを元に戻す
  });
});

describe("PixiMultiViewManager with default Ticker", () => {
  it("should use the shared Ticker when no Ticker is provided in the constructor", () => {
    const manager = new PixiMultiViewManager();
    expect(getTicker(manager)).toBe(Ticker.shared);
    manager.dispose(); // テスト後のクリーンアップ
  });
});
