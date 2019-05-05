import { Mesh, PlaneGeometry, MeshBasicMaterial, NormalBlending } from "three";
import { CanvasTexture } from "./CanvasTexture";

export class CanvasPlaneMesh extends Mesh {
  constructor(width: number, heigth: number, option?: {}) {
    super();
    this.init(width, heigth);
  }

  protected init(width: number, height: number): void {
    this.initCanvas(width, height);
    this.geometry = new PlaneGeometry(width, height);
  }

  private initCanvas(width: number, height: number): void {
    const texture: CanvasTexture = new CanvasTexture(width, height);

    this.material = new MeshBasicMaterial({
      map: texture,
      blending: NormalBlending,
      transparent: true,
      depthTest: true
    });
  }
}
