export class CanvasObject3D {
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param object 表示オブジェクト
     * @param visible
     */
    static setVisible(object, visible) {
        if (object.visible === visible) {
            return;
        }
        object.visible = visible;
        const map = (object.material.map);
        if (map == null)
            return;
        if (object.visible) {
            map.start();
        }
        else {
            map.stop();
        }
    }
}
