"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraChaser = void 0;
var three_1 = require("three");
var CameraChaser = /** @class */ (function () {
    function CameraChaser(target) {
        var _this = this;
        /**
         * 水平方向に回転し、カメラに追従するか否か。
         */
        this.isLookingCameraHorizontal = false;
        this.cameraPos = new three_1.Vector3();
        this.worldPos = new three_1.Vector3();
        this.needUpdateWorldPosition = false;
        /**
         * Planeをカメラに向ける。lookCameraHorizontal = trueの時だけ稼働する。
         * 回転方向はY軸を中心とした左右方向のみ。
         * (X軸方向には回転しない。X軸方向に回転させたい場合はBillBoardクラスを利用する。)
         *
         * カメラ位置がPlaneの北極、南極をまたぐと急激に回転するので注意。
         * 利用する場合はカメラの高さ方向に制限をかけた方が良い。
         *
         * @param render
         * @param scene
         * @param camera
         * @param geometry
         * @param material
         * @param group
         */
        this.lookCamera = function (render, scene, camera, geometry, material, group) {
            if (!_this.isLookingCameraHorizontal)
                return;
            if (_this.needUpdateWorldPosition) {
                _this.target.getWorldPosition(_this.worldPos);
                _this.needUpdateWorldPosition = false;
            }
            _this.cameraPos.set(camera.position.x, _this.worldPos.y, camera.position.z);
            _this.target.lookAt(_this.cameraPos);
        };
        this.target = target;
        this.target.getWorldPosition(this.worldPos);
        this.target.onBeforeRender = this.lookCamera;
    }
    return CameraChaser;
}());
exports.CameraChaser = CameraChaser;
