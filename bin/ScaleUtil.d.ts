import { Object3D, PerspectiveCamera } from "three";
import { WebGLRenderer } from "three";
export declare class ScaleCalculator {
    private _camera;
    private _renderer;
    private plane;
    constructor(camera: PerspectiveCamera, renderer: WebGLRenderer);
    updatePlane(): void;
    getDotByDotScale(target: Object3D): number;
}
//# sourceMappingURL=ScaleUtil.d.ts.map