import { Application, Container, Ticker } from "pixi.js";
import { BufferGeometry, Material, Texture } from "three";

/**
 * Billboard用の共有テクスチャ
 * 各Billboardはこのテクスチャを参照し、UV座標を調整して画像を表示する。
 *
 * デフォルトでは、テクスチャは自動更新されない。
 * テクスチャを共有するBillboardが責任を持って、setNeedUpdate関数を呼び出してテクスチャの更新を宣言する必要がある。
 */
export class SharedStageTexture extends Texture {
  #_app: Application;

  /**
   * 共有テクスチャを生成する
   */
  constructor() {
    super();
    this.#_app = new Application();
    this.colorSpace = "srgb";
  }

  /**
   * 共有テクスチャ用のPixi.jsインスタンスを初期化する
   *
   * @param width テクスチャの幅 単位ビクセル pow2であることを推奨
   * @param height テクスチャの高さ 単位ビクセル pow2であることを推奨
   */
  async init(width: number, height: number) {
    await this.#_app.init({
      autoStart: false,
      backgroundAlpha: 0.0,
      width,
      height,
    });
    this.image = this.#_app.canvas;
    Ticker.shared.addOnce(this.onRequestFrame);
  }

  public get stage(): Container {
    return this.#_app.stage;
  }

  public get width(): number {
    return this.#_app.renderer.width;
  }

  public get height(): number {
    return this.#_app.renderer.height;
  }

  /**
   * テクスチャの更新を宣言する
   *
   * この関数が呼び出されると、次のフレームのレンダリング時にテクスチャが更新される。
   */
  public setNeedUpdate(): void {
    Ticker.shared.addOnce(this.onRequestFrame);
  }

  private onRequestFrame = () => {
    this.#_app.render();
    this.needsUpdate = true;
  };

  public calcurateUV(rect: TextureArea): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } {
    return {
      x1: rect.x / this.width,
      y1: (this.height - rect.y - rect.height) / this.height,
      x2: (rect.x + rect.width) / this.width,
      y2: (this.height - rect.y) / this.height,
    };
  }
}

export const isSharedStageMaterial = (
  material: any,
): material is ISharedStageMaterial => {
  return "map" in material && material.map instanceof SharedStageTexture;
};

/**
 * ジオメトリにUV座標を設定する。
 */
export const updateUVAttribute = (
  geometry: BufferGeometry,
  material: Material,
  textureArea: TextureArea,
): void => {
  if (!isSharedStageMaterial(material)) {
    throw new Error("sharedMaterial.map must be SharedStageTexture");
  }
  const area = material.map.calcurateUV(textureArea);
  const uv = geometry.getAttribute("uv");
  uv.setXY(0, area.x1, area.y2);
  uv.setXY(1, area.x2, area.y2);
  uv.setXY(2, area.x1, area.y1);
  uv.setXY(3, area.x2, area.y1);
  uv.needsUpdate = true;
};

/**
 * テクスチャからどの領域を表示するのかを表すインターフェース
 */
export interface TextureArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * mapがSharedStageTextureであることを保証するためのインターフェース
 */
export interface ISharedStageMaterial {
  map: SharedStageTexture;
}
