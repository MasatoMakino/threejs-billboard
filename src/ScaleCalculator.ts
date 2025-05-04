import { type PerspectiveCamera, MathUtils } from "three";

/**
 * ビルボードのスケール値をカメラとレンダラーから算出するためのユーティリティ。
 */
export const ScaleCalculator = {
  /**
   * SpriteMaterial.sizeAttenuation = false
   * の設定されたSprite用のスケール値を取得する。
   *
   * @param rendererHeight レンダラーで描画するCanvasの高さ 単位ピクセル
   * @param camera
   */
  getNonAttenuateScale(
    rendererHeight: number,
    camera: PerspectiveCamera,
  ): number {
    return getFovHeight(1.0, camera) / rendererHeight;
  },
};

const getFovHeight = (distance: number, camera: PerspectiveCamera): number => {
  const halfFov = MathUtils.degToRad(camera.fov / 2);
  const half_fov_height = Math.tan(halfFov) * distance;
  return half_fov_height * 2;
};
