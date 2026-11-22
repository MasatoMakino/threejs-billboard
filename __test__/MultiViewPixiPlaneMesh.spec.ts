import { Ticker } from "pixi.js";
import type { MeshBasicMaterial } from "three";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { MultiViewPixiPlaneMesh } from "../src/MultiViewPixiPlaneMesh.js";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import type { IRenderablePixiView } from "../src/RenderablePixiView.js";

describe("MultiViewPixiPlaneMesh", () => {
  let manager: PixiMultiViewManager; // モックではなく実際のインスタンス
  let ticker: Ticker; // テスト制御用のTicker
  let planeMesh: MultiViewPixiPlaneMesh;
  const width = 100;
  const height = 200;

  // スパイの定義
  let requestRenderSpy: MockInstance<(instance: IRenderablePixiView) => void>;
  let consoleWarnSpy: MockInstance<{
    (...data: unknown[]): void;
    (message?: unknown, ...optionalParams: unknown[]): void;
  }>;

  // 非同期処理を含むためasync
  beforeEach(async () => {
    // console.warn をスパイ
    consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    // テスト制御用のTickerインスタンスを作成
    ticker = new Ticker();
    ticker.autoStart = false; // autoStartを無効化

    // 実際のPixiMultiViewManagerインスタンスを作成
    manager = new PixiMultiViewManager({ ticker });
    await manager.init(); // 非同期初期化を待つ
    ticker.stop(); // テストのためにTickerを停止

    // 実際のクラスのメソッドをスパイ
    requestRenderSpy = vi.spyOn(manager, "requestRender");

    // テスト対象のインスタンス生成
    planeMesh = new MultiViewPixiPlaneMesh({ manager, width, height });
  });

  afterEach(() => {
    // 各テストの後にインスタンスを破棄
    if (!planeMesh.isDisposed) {
      planeMesh.dispose();
    }
    // マネージャーとTickerを破棄
    manager.dispose();
    ticker.destroy();

    // スパイのリセット
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("sizes the canvas to width×height, attaches a camera chaser, and queues the first render", () => {
    expect(planeMesh.canvas.width).toBe(width);
    expect(planeMesh.canvas.height).toBe(height);
    expect((planeMesh.material as MeshBasicMaterial).map).toBe(
      planeMesh.texture,
    );
    expect(planeMesh.cameraChaser).toBeDefined();
    expect(planeMesh.isDisposed).toBe(false);
    expect(requestRenderSpy).toHaveBeenCalledWith(planeMesh);
  });

  it("setScale should set the scale of the mesh", () => {
    const scale = 0.5;
    planeMesh.setScale(scale);
    expect(planeMesh.scale.x).toBe(scale);
    expect(planeMesh.scale.y).toBe(scale);
    expect(planeMesh.scale.z).toBe(1);
  });

  it("setScale should not set scale if disposed", () => {
    planeMesh.dispose();
    consoleWarnSpy.mockClear(); // dispose後のconsole.warn呼び出しをクリア

    const scale = 0.5;
    const initialScale = planeMesh.scale.clone();
    planeMesh.setScale(scale);
    expect(planeMesh.scale.x).toBe(initialScale.x);
    expect(planeMesh.scale.y).toBe(initialScale.y);
    expect(planeMesh.scale.z).toBe(initialScale.z);
    expect(consoleWarnSpy).toHaveBeenCalledOnce();
  });

  it("updateContent should request render from manager", () => {
    requestRenderSpy.mockClear(); // Clear initial call
    planeMesh.updateContent();
    expect(requestRenderSpy).toHaveBeenCalledWith(planeMesh);
  });

  it("updateContent should not request render if disposed", () => {
    planeMesh.dispose();
    requestRenderSpy.mockClear(); // Clear initial call
    consoleWarnSpy.mockClear(); // Clear initial call

    planeMesh.updateContent();
    expect(requestRenderSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledOnce();
  });

  it("dispose runs the dispose of three once, so that three releases what it holds for the object", () => {
    const listener = vi.fn();
    planeMesh.addEventListener("dispose", listener);

    planeMesh.dispose();
    planeMesh.dispose();

    expect(listener).toHaveBeenCalledOnce();
  });
});
