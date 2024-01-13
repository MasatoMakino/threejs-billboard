import { PerspectiveCamera, MathUtils } from "three";

/**
 * ビルボードのスケール値をカメラとレンダラーから算出するためのクラス。
 */
export class ScaleCalculator {
  /**
   * SpriteMaterial.sizeAttenuation = false
   * の設定されたSprite用のスケール値を取得する。
   *
   * @param rendererHeight レンダラーの高さ 単位ピクセル
   * @param camera カメラ
   */
  public static getNonAttenuateScale(
    rendererHeight: number,
    camera: PerspectiveCamera,
  ): number {
    return ScaleCalculator.getFovHeight(1.0, camera) / rendererHeight;
  }

  private static getFovHeight(
    distance: number,
    camera: PerspectiveCamera,
  ): number {
    const halfFov = MathUtils.degToRad(camera.fov / 2);
    const half_fov_height = Math.tan(halfFov) * distance;
    return half_fov_height * 2;
  }
}
