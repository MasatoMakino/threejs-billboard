import { type Material, Mesh, PlaneGeometry } from "three";
import { CameraChaser } from "./CameraChaser.js";
import {
  isSharedStageMaterial,
  type TextureArea,
  updateUVAttribute,
} from "./SharedStageTexture.js";

/**
 * SharedStagePlaneMesh クラスは、単一の共有 Canvas および Texture を使用して描画されるプレーンメッシュ機能を提供します。
 * Three.js の Mesh を継承し、共有テクスチャ上の特定の領域を表示します。
 * CameraChaser によるカメラ追従機能も提供します。
 *
 * ## 概要
 * Canvasに描画可能な板オブジェクトです。
 * SharedStageTexture を使用し、共有テクスチャ上の特定の領域をプレーンメッシュとして表示します。
 * ビルボードと異なり、デフォルトではカメラには追従しませんが、CameraChaser を使用して追従させることも可能です。
 *
 * ## MultiView クラス群との比較
 * MultiViewPixiPlaneMesh クラスと比較して、SharedStagePlaneMesh は単一の共有 Canvas と Texture を使用するため、
 * テクスチャとマテリアルインスタンスを複数のプレーンメッシュで共有可能で、ドローコール数の削減が期待できます。
 * 一方、共有 Canvas のサイズに限界があり、多数のプレーンメッシュを配置するとテクスチャのマッピングに失敗する可能性があります。
 * また、部分的な内容更新が多い場合には、共有 Canvas 全体の再描画が必要となり、パフォーマンスが低下する可能性があります。
 *
 * SharedStagePlaneMesh は、プレーンメッシュの数が比較的固定されており、パフォーマンスのためにドローコール数を削減したい場合に適しています。
 *
 * ## ジオメトリに関する注意
 * ジオメトリは PlaneGeometry なので、中心点からずらす場合は translate を使用してください。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 *
 * 各頂点には UV 座標が設定されます。
 * 4頂点2ポリゴンであることを前提としているため、それ以外のジオメトリを渡した場合は正常に動作しない可能性があります。
 */
export class SharedStagePlaneMesh extends Mesh {
  public cameraChaser: CameraChaser = new CameraChaser(this);

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
    const prevTextureArea = { ...this._textureArea };
    this._textureArea = { ...value };

    if (
      prevTextureArea.width !== value.width ||
      prevTextureArea.height !== value.height
    ) {
      this.geometry = new PlaneGeometry(value.width, value.height);
    }
    this.updateUVAttribute();
  }

  /**
   * SharedStagePlaneMesh の新しいインスタンスを生成します。
   * @param sharedMaterial - 共有される Material インスタンス。
   * @param _textureArea - テクスチャの表示領域（ピクセル単位）。
   */
  constructor(
    public sharedMaterial: Material,
    private _textureArea: TextureArea,
  ) {
    super();

    if (!isSharedStageMaterial(sharedMaterial)) {
      throw new Error("sharedMaterial.map must be SharedStageTexture");
    }
    this.geometry = new PlaneGeometry(_textureArea.width, _textureArea.height);
    this.material = sharedMaterial as unknown as Material;
    this.updateUVAttribute();
  }

  /**
   * ジオメトリにUV座標を設定する。
   */
  private updateUVAttribute(): void {
    updateUVAttribute(this.geometry, this.sharedMaterial, this._textureArea);
  }
}
