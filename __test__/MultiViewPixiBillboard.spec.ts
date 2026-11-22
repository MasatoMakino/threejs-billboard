import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from "vitest";
import { MultiViewPixiBillboard } from "../src/MultiViewPixiBillboard.js";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import type { SpriteMaterial } from "three";
import { Ticker } from "pixi.js";
import type { IRenderablePixiView } from "../src/RenderablePixiView.js";

describe("MultiViewPixiBillboard", () => {
  let manager: PixiMultiViewManager;
  let ticker: Ticker; // テスト制御用のTicker
  let billboard: MultiViewPixiBillboard;
  const width = 50;
  const height = 100;
  const initialScale = 0.02;

  // スパイの定義
  let requestRenderSpy: MockInstance<(instance: IRenderablePixiView) => void>;
  let consoleWarnSpy: MockInstance<{
    (...data: unknown[]): void;
    (message?: unknown, ...optionalParams: unknown[]): void;
  }>;

  // 非同期処理を含むためasync
  beforeEach(async () => {
    consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    // テスト制御用のTickerインスタンスを作成
    ticker = new Ticker();
    ticker.autoStart = false; // autoStartを無効化

    manager = new PixiMultiViewManager({ ticker });
    await manager.init(); // 非同期初期化を待つ
    ticker.stop(); // テストのためにTickerを停止

    // 実際のクラスのメソッドをスパイ
    requestRenderSpy = vi.spyOn(manager, "requestRender");

    // テスト対象のインスタンス生成
    billboard = new MultiViewPixiBillboard({
      manager,
      width,
      height,
      scale: initialScale,
    });
  });

  afterEach(() => {
    // 各テストの後にインスタンスを破棄
    if (!billboard.isDisposed) {
      billboard.dispose();
    }
    // マネージャーとTickerを破棄
    manager.dispose();
    ticker.destroy();

    // スパイのリセット
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("sizes the canvas to width×height and the sprite to scale×canvas size, and queues the first render", () => {
    expect(billboard.canvas.width).toBe(width);
    expect(billboard.canvas.height).toBe(height);
    expect((billboard.material as SpriteMaterial).map).toBe(billboard.texture);
    expect(billboard.isDisposed).toBe(false);
    expect(billboard.scale.x).toBe(initialScale * width);
    expect(billboard.scale.y).toBe(initialScale * height);
    expect(billboard.scale.z).toBe(1);
    expect(requestRenderSpy).toHaveBeenCalledWith(billboard);
  });

  it("should update sprite scale when setScale is called", () => {
    const scale = 0.1;
    billboard.setScale(scale);
    expect(billboard.scale.x).toBe(scale * width);
    expect(billboard.scale.y).toBe(scale * height);
    expect(billboard.scale.z).toBe(1);
  });

  it("setScale after dispose keeps the scale and warns, so that a disposed billboard is not requeued", () => {
    billboard.dispose();
    requestRenderSpy.mockClear(); // dispose後のrequestRender呼び出しをクリア
    consoleWarnSpy.mockClear(); // dispose後のconsole.warn呼び出しをクリア

    const scale = 0.1;
    const initialScaleValue = billboard.scale.x / width; // Calculate initial scale value
    billboard.setScale(scale);
    expect(billboard.scale.x).toBe(initialScaleValue * width);
    expect(billboard.scale.y).toBe(initialScaleValue * height);
    expect(billboard.scale.z).toBe(1);
    expect(consoleWarnSpy).toHaveBeenCalledOnce();
    expect(requestRenderSpy).not.toHaveBeenCalled();
  });

  it("updateContent should request render from manager", () => {
    requestRenderSpy.mockClear(); // Clear initial call
    billboard.updateContent();
    expect(requestRenderSpy).toHaveBeenCalledWith(billboard);
  });

  it("updateContent should not request render if disposed", () => {
    billboard.dispose();
    requestRenderSpy.mockClear(); // Clear initial call

    billboard.updateContent();
    expect(requestRenderSpy).not.toHaveBeenCalled();
  });

  it("dispose runs the dispose of three once, so that three releases what it holds for the object", () => {
    const listener = vi.fn();
    billboard.addEventListener("dispose", listener);

    billboard.dispose();
    billboard.dispose();

    expect(listener).toHaveBeenCalledOnce();
  });

  it("should use default scale when scale is undefined in options", () => {
    const billboardWithDefaultScale = new MultiViewPixiBillboard({
      manager,
      width,
      height,
    });

    const expectedScale = 0.1;
    expect(billboardWithDefaultScale.scale.x).toBe(expectedScale * width);
    expect(billboardWithDefaultScale.scale.y).toBe(expectedScale * height);
    expect(billboardWithDefaultScale.scale.z).toBe(1);

    billboardWithDefaultScale.dispose();
  });
});
