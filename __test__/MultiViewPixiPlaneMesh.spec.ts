import { Container, Ticker } from "pixi.js";
import {
  CanvasTexture,
  MeshBasicMaterial,
  PlaneGeometry,
  SpriteMaterial,
} from "three";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import { CameraChaser } from "../src/CameraChaser.js";
import { MultiViewObject3DUtils } from "../src/MultiViewObject3DUtils.js";
import { MultiViewPixiPlaneMesh } from "../src/MultiViewPixiPlaneMesh.js";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import { IRenderablePixiView } from "../src/RenderablePixiView.js";

// 依存クラスのモック化
vi.mock("../src/MultiViewObject3DUtils.js");

describe("MultiViewPixiPlaneMesh", () => {
  let manager: PixiMultiViewManager; // モックではなく実際のインスタンス
  let ticker: Ticker; // テスト制御用のTicker
  let planeMesh: MultiViewPixiPlaneMesh;
  const width = 100;
  const height = 200;

  // スパイの定義
  let requestRenderSpy: MockInstance<(instance: IRenderablePixiView) => void>;
  let cameraChaserDisposeSpy: MockInstance<() => void>;
  let disposeMaterialsSpy: MockInstance<
    (
      materials:
        | (MeshBasicMaterial | SpriteMaterial)
        | (MeshBasicMaterial | SpriteMaterial)[],
    ) => void
  >;
  let disposeStageContainerSpy: MockInstance<(container: Container) => void>;
  let disposeCanvasSpy: MockInstance<(canvas: HTMLCanvasElement) => void>;
  let consoleWarnSpy: MockInstance<{
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
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
    manager = new PixiMultiViewManager(ticker);
    await manager.init(); // 非同期初期化を待つ
    ticker.stop(); // テストのためにTickerを停止

    // 実際のクラスのメソッドをスパイ
    requestRenderSpy = vi.spyOn(manager, "requestRender");
    cameraChaserDisposeSpy = vi.spyOn(CameraChaser.prototype, "dispose"); // prototypeをスパイ
    disposeMaterialsSpy = vi.spyOn(MultiViewObject3DUtils, "disposeMaterials");
    disposeStageContainerSpy = vi.spyOn(
      MultiViewObject3DUtils,
      "disposeStageContainer",
    );
    disposeCanvasSpy = vi.spyOn(MultiViewObject3DUtils, "disposeCanvas");

    // テスト対象のインスタンス生成
    planeMesh = new MultiViewPixiPlaneMesh(manager, width, height);
    // cameraChaser = planeMesh.cameraChaser!; // 生成されたCameraChaserインスタンスを取得
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
    vi.restoreAllMocks();
  });

  it("should be created with correct initial properties", () => {
    expect(planeMesh).toBeInstanceOf(MultiViewPixiPlaneMesh);
    expect(planeMesh.geometry).toBeInstanceOf(PlaneGeometry);
    expect(planeMesh.material).toBeInstanceOf(MeshBasicMaterial);
    expect(planeMesh.canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(planeMesh.canvas.width).toBe(width);
    expect(planeMesh.canvas.height).toBe(height);
    expect(planeMesh.container).toBeInstanceOf(Container);
    expect(planeMesh.texture).toBeInstanceOf(CanvasTexture);
    expect((planeMesh.material as MeshBasicMaterial).map).toBe(
      planeMesh.texture,
    );
    expect((planeMesh as any)._manager).toBe(manager); // モックではなく実際のインスタンス
    expect(planeMesh.cameraChaser).toBeInstanceOf(CameraChaser); // 実際のインスタンス
    expect(planeMesh.isDisposed).toBe(false);
    expect(requestRenderSpy).toHaveBeenCalledWith(planeMesh); // スパイで検証
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
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Attempted to set scale on disposed MultiViewPixiPlaneMesh.",
    );
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
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Attempted to update disposed MultiViewPixiPlaneMesh.",
    );
  });

  it("dispose should set isDisposed to true and clean up resources", () => {
    const geometryDisposeSpy = vi.spyOn(planeMesh.geometry, "dispose");
    const removeFromParentSpy = vi.spyOn(planeMesh, "removeFromParent");

    planeMesh.dispose();

    expect(planeMesh.isDisposed).toBe(true);
    expect(geometryDisposeSpy).toHaveBeenCalledOnce();
    expect(disposeMaterialsSpy).toHaveBeenCalledWith(planeMesh.material);
    expect(disposeStageContainerSpy).toHaveBeenCalledWith(planeMesh.container);
    expect(disposeCanvasSpy).toHaveBeenCalledWith(planeMesh.canvas);
    expect(removeFromParentSpy).toHaveBeenCalledOnce();
    expect(cameraChaserDisposeSpy).toHaveBeenCalledOnce(); // スパイで検証
    expect(planeMesh.cameraChaser).toBeUndefined();

    geometryDisposeSpy.mockRestore();
    removeFromParentSpy.mockRestore();
  });

  it("dispose should not run cleanup if already disposed", () => {
    planeMesh.dispose();
    const geometryDisposeSpy = vi.spyOn(planeMesh.geometry, "dispose");
    const removeFromParentSpy = vi.spyOn(planeMesh, "removeFromParent");
    cameraChaserDisposeSpy.mockClear();
    disposeMaterialsSpy.mockClear();
    disposeStageContainerSpy.mockClear();
    disposeCanvasSpy.mockClear();

    planeMesh.dispose();
    expect(planeMesh.isDisposed).toBe(true); // Should remain true
    expect(geometryDisposeSpy).not.toHaveBeenCalled();
    expect(disposeMaterialsSpy).not.toHaveBeenCalled();
    expect(disposeStageContainerSpy).not.toHaveBeenCalled();
    expect(disposeCanvasSpy).not.toHaveBeenCalled();
    expect(removeFromParentSpy).not.toHaveBeenCalled();
    expect(cameraChaserDisposeSpy).not.toHaveBeenCalled();

    geometryDisposeSpy.mockRestore();
    removeFromParentSpy.mockRestore();
  });
});
