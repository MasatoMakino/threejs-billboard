import { PlaneGeometry, Sprite, SpriteMaterial } from "three";
import {
  TextureArea,
  isSharedStageMaterial,
  updateUVAttribute,
} from "./index.js";

export class SharedStageBillboard extends Sprite {
  get imageScale() {
    return this._imageScale;
  }
  set imageScale(value: number) {
    this._imageScale = value;
    this.updateScale();
  }

  /**
   * 現在の表示領域を取得する。
   *
   * @returns テクスチャの表示領域 単位ビクセル
   */
  cloneTextureArea(): TextureArea {
    return { ...this._textureArea };
  }

  /**
   * 共有テクスチャからビルボードに表示する領域を更新する。
   *
   * @param value テクスチャの表示領域 単位ビクセル
   */
  updateTextureAreaAndUV(value: TextureArea) {
    this._textureArea = { ...value };
    this.updateScale();
    this.updateUVAttribute();
  }

  constructor(
    public sharedMaterial: SpriteMaterial,
    private _textureArea: TextureArea,
    private _imageScale: number = 1,
  ) {
    super();

    if (!isSharedStageMaterial(sharedMaterial)) {
      throw new Error("sharedMaterial.map must be SharedStageTexture");
    }

    /**
     * SharedStageBillboardでは、Sprite間でジオメトリを共有しない。
     * 個別にUV座標を持つため。
     * また、PlaneとpositionおよびUVを共通化するためPlaneGeometryを使用する。
     */
    this.geometry = new PlaneGeometry();

    this.material = sharedMaterial;
    this.updateScale();
    this.updateUVAttribute();
  }

  /**
   * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
   */
  private updateScale(): void {
    this.scale.set(
      this._textureArea.width * this._imageScale,
      this._textureArea.height * this._imageScale,
      1,
    );
  }

  /**
   * ジオメトリにUV座標を設定する。
   */
  private updateUVAttribute(): void {
    updateUVAttribute(this.geometry, this.sharedMaterial, this._textureArea);
  }
}
