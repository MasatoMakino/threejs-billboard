import { Mesh, PlaneGeometry, MeshBasicMaterial, NormalBlending } from "three";
import { CanvasTexture } from "./CanvasTexture";
export class CanvasPlaneMesh extends Mesh {
    constructor(width, heigth, option) {
        super();
        this.init(width, heigth);
    }
    init(width, height) {
        this.initCanvas(width, height);
        this.geometry = new PlaneGeometry(width, height);
    }
    initCanvas(width, height) {
        const texture = new CanvasTexture(width, height);
        this.material = new MeshBasicMaterial({
            map: texture,
            blending: NormalBlending,
            transparent: true,
            depthTest: true
        });
    }
}
