import { Object3D } from "three";
export declare class CameraChaser {
    /**
     * 水平方向に回転し、カメラに追従するか否か。
     */
    isLookingCameraHorizontal: boolean;
    private cameraPos;
    private worldPos;
    private target;
    needUpdateWorldPosition: boolean;
    constructor(target: Object3D);
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
    private lookCamera;
}
//# sourceMappingURL=CameraChaser.d.ts.map