"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StageObject3D = /** @class */ (function () {
    function StageObject3D() {
    }
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param object 表示オブジェクト
     * @param visible
     */
    StageObject3D.setVisible = function (object, visible) {
        if (object.visible === visible) {
            return;
        }
        object.visible = visible;
        var map = (object.material.map);
        if (map == null)
            return;
        if (object.visible) {
            map.start();
        }
        else {
            map.stop();
        }
    };
    return StageObject3D;
}());
exports.StageObject3D = StageObject3D;
