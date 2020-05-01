import {Mesh, Sprite} from "three";

export declare class StageObject3D {
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param object 表示オブジェクト
     * @param visible
     */
    static setVisible(object: Mesh | Sprite, visible: boolean): void;
}
//# sourceMappingURL=StageObject3D.d.ts.map