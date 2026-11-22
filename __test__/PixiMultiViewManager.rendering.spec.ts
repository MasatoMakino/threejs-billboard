import { Container, Ticker, Graphics } from "pixi.js";
import type { Texture } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import type { IRenderablePixiView } from "../src/RenderablePixiView";

// autoDetectRenderer のモック化はここでは行わない。実際のレンダラーを使用する。

/**
 * テスト用のIRenderablePixiViewモックを作成する関数
 * @param canvas テストに使用するHTMLCanvasElement
 * @returns IRenderablePixiView
 */
const createMockRenderablePixiView = (canvas: HTMLCanvasElement) => {
  return {
    isDisposed: false,
    canvas: canvas,
    texture: { needsUpdate: false } as Texture, // needsUpdateプロパティを追加
    container: new Container(),
  } as IRenderablePixiView;
};

/**
 * canvasの指定された座標のピクセル色を取得するヘルパー関数
 * @param canvas 対象のcanvas要素
 * @param x X座標
 * @param y Y座標
 * @returns RGBA色の配列 [R, G, B, A]
 */
const getPixelColor = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
): Uint8ClampedArray => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context from canvas.");
  }
  const imageData = ctx.getImageData(x, y, 1, 1);
  return imageData.data;
};

describe("PixiMultiViewManager Rendering", () => {
  let manager: PixiMultiViewManager;
  let ticker: Ticker;
  let testCanvas: HTMLCanvasElement;
  let mockView: IRenderablePixiView;

  beforeEach(async () => {
    // テスト制御用のTickerインスタンスを作成
    ticker = new Ticker();
    ticker.autoStart = false; // autoStartを無効化

    // テスト用のcanvasを作成
    testCanvas = document.createElement("canvas");
    testCanvas.width = 100;
    testCanvas.height = 100;
    // bodyに追加しないとレンダリングコンテキストの取得に失敗する場合がある
    document.body.appendChild(testCanvas);

    // 実際のPixiMultiViewManagerインスタンスを作成
    manager = new PixiMultiViewManager({ ticker });

    // initを呼び出し、非同期初期化を待つ
    await manager.init();
    ticker.update(0);
    ticker.stop();

    // テスト用のIRenderablePixiViewモックを作成
    mockView = createMockRenderablePixiView(testCanvas);
  });

  afterEach(() => {
    // 各テストの後にインスタンスを破棄
    if (manager && !manager.isDisposed) {
      manager.dispose();
    }
    ticker.destroy();

    // テスト用canvasをbodyから削除
    if (testCanvas?.parentElement) {
      testCanvas.parentElement.removeChild(testCanvas);
    }

    // スパイとモックの実装をリストア
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("draws the container into the view canvas and flags the texture for upload, so that three.js shows what PixiJS drew", async () => {
    // canvas全体を覆うGraphicsを作成し、赤色で塗りつぶす
    const graphics = new Graphics();
    graphics.rect(0, 0, testCanvas.width, testCanvas.height).fill(0xff0000); // 赤色
    mockView.container.addChild(graphics);

    manager.requestRender(mockView);

    ticker.update(1); // currentTimeは0以上の値

    const pixelColor = getPixelColor(testCanvas, 50, 50);

    expect(pixelColor[0]).toBe(255);
    expect(pixelColor[1]).toBe(0);
    expect(pixelColor[2]).toBe(0);
    expect(pixelColor[3]).toBe(255);

    expect(mockView.texture.needsUpdate).toBe(true);
  });

  it("clears the canvas before each render, so that content removed from the container disappears", async () => {
    // 事前に全体を覆うGraphicsを作成し、レンダリングする（クリアされることを確認するため）
    const initialGraphics = new Graphics();
    initialGraphics
      .rect(0, 0, testCanvas.width, testCanvas.height)
      .fill(0x00ff00); // 緑色
    mockView.container.addChild(initialGraphics);
    manager.requestRender(mockView);
    ticker.update(1);

    mockView.container.removeChild(initialGraphics);

    const smallRectSize = 20;
    const smallRectX = (testCanvas.width - smallRectSize) / 2;
    const smallRectY = (testCanvas.height - smallRectSize) / 2;
    const centralGraphics = new Graphics();
    centralGraphics
      .rect(smallRectX, smallRectY, smallRectSize, smallRectSize)
      .fill(0x0000ff); // 青色
    mockView.container.addChild(centralGraphics);

    manager.requestRender(mockView);

    ticker.update(2);

    const centerPixelColor = getPixelColor(testCanvas, 50, 50);

    expect(centerPixelColor[0]).toBe(0);
    expect(centerPixelColor[1]).toBe(0);
    expect(centerPixelColor[2]).toBe(255);
    expect(centerPixelColor[3]).toBe(255);

    const cornerPixelColor = getPixelColor(testCanvas, 1, 1);

    expect(cornerPixelColor[0]).toBe(0);
    expect(cornerPixelColor[1]).toBe(0);
    expect(cornerPixelColor[2]).toBe(0);
    expect(cornerPixelColor[3]).toBe(0);

    expect(mockView.texture.needsUpdate).toBe(true);
  });
});
