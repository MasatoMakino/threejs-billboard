import { Material, Mesh, PlaneGeometry } from "three";
import { CameraChaser } from "./CameraChaser.js";
import {
  isSharedStageMaterial,
  TextureArea,
  updateUVAttribute,
} from "./SharedStageTexture.js";

/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneGeometryなので、中心点からずらす場合はtranslateを使用する。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 *
 * 各頂点にはUV座標が設定される。
 * 4頂点2ポリゴンであることを前提としているため、それ以外のジオメトリを渡した場合は正常に動作しない。
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
      //TODO : ジオメトリの再生性ではなく、positionアトリビュートの更新で対応可能か検討する。
      this.geometry = new PlaneGeometry(value.width, value.height);
    }
    this.updateUVAttribute();
  }

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
