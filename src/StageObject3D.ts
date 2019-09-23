import { StageTexture } from "./StageTexture";
import { Sprite } from "three";
import { Mesh } from "three";
import { MeshBasicMaterial } from "three";
import { SpriteMaterial } from "three";

export class StageObject3D {
  /**
   * オブジェクトの表示/非表示を設定する。
   * 設定に応じてテクスチャの更新を停止/再開する。
   * @param object 表示オブジェクト
   * @param visible
   */
  public static setVisible(object: Mesh | Sprite, visible: boolean): void {
    if (object.visible === visible) {
      return;
    }
    object.visible = visible;

    const map: StageTexture = <StageTexture>(
      (<MeshBasicMaterial | SpriteMaterial>object.material).map
    );
    if (map == null) return;
    if (object.visible) {
      map.start();
    } else {
      map.stop();
    }
  }
}