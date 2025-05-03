import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from "vitest";
import { MultiViewPixiBillboard } from "../src/MultiViewPixiBillboard.js";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import { SpriteMaterial, CanvasTexture, MeshBasicMaterial } from "three";
import { Container, Ticker } from "pixi.js";
import { MultiViewObject3DUtils } from "../src/MultiViewObject3DUtils.js";
import { IRenderablePixiView } from "../src/RenderablePixiView.js";

describe("MultiViewPixiBillboard", () => {
  let manager: PixiMultiViewManager;
  let ticker: Ticker; // テスト制御用のTicker
  let billboard: MultiViewPixiBillboard;
  const width = 50;
  const height = 100;
  const initialScale = 0.02;

  // スパイの定義
  let requestRenderSpy: MockInstance<(instance: IRenderablePixiView) => void>;
  let disposeMaterialsSpy: MockInstance<
    (
      materials:
        | (SpriteMaterial | MeshBasicMaterial)
        | (SpriteMaterial | MeshBasicMaterial)[],
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
    disposeMaterialsSpy = vi.spyOn(MultiViewObject3DUtils, "disposeMaterials");
    disposeStageContainerSpy = vi.spyOn(
      MultiViewObject3DUtils,
      "disposeStageContainer",
    );
    disposeCanvasSpy = vi.spyOn(MultiViewObject3DUtils, "disposeCanvas");

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
    vi.restoreAllMocks();
  });

  it("should be created with correct initial properties", () => {
    expect(billboard).toBeInstanceOf(MultiViewPixiBillboard);
    expect(billboard.material).toBeInstanceOf(SpriteMaterial);
    expect(billboard.canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(billboard.canvas.width).toBe(width);
    expect(billboard.canvas.height).toBe(height);
    expect(billboard.container).toBeInstanceOf(Container);
    expect(billboard.texture).toBeInstanceOf(CanvasTexture);
    expect((billboard.material as SpriteMaterial).map).toBe(billboard.texture);
    expect(billboard["_manager"]).toBe(manager); // モックではなく実際のインスタンス
    expect(billboard.isDisposed).toBe(false);
    expect(billboard.scale.x).toBe(initialScale * width);
    expect(billboard.scale.y).toBe(initialScale * height);
    expect(billboard.scale.z).toBe(1);
    expect(requestRenderSpy).toHaveBeenCalledWith(billboard); // スパイで検証
  });

  it("setScale should set the scale of the sprite", () => {
    const scale = 0.1;
    billboard.setScale(scale);
    expect(billboard.scale.x).toBe(scale * width);
    expect(billboard.scale.y).toBe(scale * height);
    expect(billboard.scale.z).toBe(1);
    expect(requestRenderSpy).toHaveBeenCalledWith(billboard); // setScaleもrequestRenderを呼ぶ
    expect(requestRenderSpy).toHaveBeenCalledTimes(2); // 初期化時とsetScaleで2回呼ばれる
  });

  it("setScale should not set scale if disposed", () => {
    billboard.dispose();
    requestRenderSpy.mockClear(); // dispose後のrequestRender呼び出しをクリア
    consoleWarnSpy.mockClear(); // dispose後のconsole.warn呼び出しをクリア

    const scale = 0.1;
    const initialScaleValue = billboard.scale.x / width; // Calculate initial scale value
    billboard.setScale(scale);
    expect(billboard.scale.x).toBe(initialScaleValue * width);
    expect(billboard.scale.y).toBe(initialScaleValue * height);
    expect(billboard.scale.z).toBe(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Attempted to set scale on disposed MultiViewPixiBillboard.",
    );
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
    consoleWarnSpy.mockClear(); // Clear initial call

    billboard.updateContent();
    expect(requestRenderSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Attempted to update disposed MultiViewPixiBillboard.",
    );
  });

  it("dispose should set isDisposed to true and clean up resources", () => {
    const geometryDisposeSpy = vi.spyOn(billboard.geometry, "dispose");
    const removeFromParentSpy = vi.spyOn(billboard, "removeFromParent");

    billboard.dispose();

    expect(billboard.isDisposed).toBe(true);
    expect(geometryDisposeSpy).toHaveBeenCalledOnce();
    expect(disposeMaterialsSpy).toHaveBeenCalledWith(billboard.material);
    expect(disposeStageContainerSpy).toHaveBeenCalledWith(billboard.container);
    expect(disposeCanvasSpy).toHaveBeenCalledWith(billboard.canvas);
    expect(removeFromParentSpy).toHaveBeenCalledOnce();

    geometryDisposeSpy.mockRestore();
    removeFromParentSpy.mockRestore();
  });

  it("dispose should not run cleanup if already disposed", () => {
    billboard.dispose();
    const geometryDisposeSpy = vi.spyOn(billboard.geometry, "dispose");
    const removeFromParentSpy = vi.spyOn(billboard, "removeFromParent");
    disposeMaterialsSpy.mockClear();
    disposeStageContainerSpy.mockClear();
    disposeCanvasSpy.mockClear();

    billboard.dispose(); // 再度disposeを呼び出す

    expect(billboard.isDisposed).toBe(true); // Should remain true
    expect(geometryDisposeSpy).not.toHaveBeenCalled();
    expect(disposeMaterialsSpy).not.toHaveBeenCalled();
    expect(disposeStageContainerSpy).not.toHaveBeenCalled();
    expect(disposeCanvasSpy).not.toHaveBeenCalled();
    expect(removeFromParentSpy).not.toHaveBeenCalled();

    geometryDisposeSpy.mockRestore();
    removeFromParentSpy.mockRestore();
  });
});
