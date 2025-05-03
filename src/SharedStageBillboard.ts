import { PlaneGeometry, Sprite, type SpriteMaterial } from "three";
import {
  type TextureArea,
  isSharedStageMaterial,
  updateUVAttribute,
} from "./index.js";

/**
 * SharedStageBillboard クラスは、単一の共有 Canvas および Texture を使用して描画されるビルボード機能を提供します。
 * Three.js の Sprite を継承し、共有テクスチャ上の特定の領域を表示します。
 *
 * ## 概要
 * SharedStageTexture を使用し、共有テクスチャ上の特定の領域をビルボードとして表示します。
 *
 * ## MultiView クラス群との比較
 * MultiViewPixiBillboard クラスと比較して、SharedStageBillboard は単一の共有CanvasとTextureを使用するため、
 * テクスチャとマテリアルインスタンスを複数のビルボードで共有可能で、ドローコール数の削減が期待できます。
 * 一方、共有Canvasのサイズに限界があり、多数のビルボードを配置するとテクスチャのマッピングに失敗する可能性があります。
 * また、部分的な内容更新が多い場合には、共有 Canvas 全体の再描画が必要となり、パフォーマンスが低下する可能性があります。
 *
 * SharedStageBillboard は、ビルボードの数が比較的固定されており、パフォーマンスのためにドローコール数を削減したい場合に適しています。
 *
 * ## ジオメトリに関する注意
 * 一般的なSpriteインスタンスでは、固定値のBufferGeometryを使用しますが、
 * SharedStageBillboardクラスでは、以下の理由でこの固定値BufferGeometryを使用せず、PlaneGeometryを使用しています。
 * - 個別のインスタンスでuv attributeを上書きするため
 * - SharedStagePlaneMeshとpositionおよびUVの処理を共通化するため
 * three.jsのメジャーアップデートにより、Spriteクラスの仕様が変更された場合、影響を受ける可能性があります。
 */
export class SharedStageBillboard extends Sprite {
  /**
   * 画像のスケールファクター。
   */
  get imageScale() {
    return this._imageScale;
  }
  /**
   * 画像のスケールファクターを設定します。
   */
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

  /**
   * SharedStageBillboard の新しいインスタンスを生成します。
   * @param sharedMaterial - 共有される SpriteMaterial インスタンス。
   * @param _textureArea - テクスチャの表示領域（ピクセル単位）。
   * @param _imageScale - 画像の初期スケールファクター。
   */
  constructor(
    public sharedMaterial: SpriteMaterial,
    private _textureArea: TextureArea,
    private _imageScale = 1,
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
