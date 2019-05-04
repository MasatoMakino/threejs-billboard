import { Sprite, LinearFilter, SpriteMaterial, NormalBlending } from "three";
import { CanvasTexture } from "./CanvasTexture";

export class CanvasBillBoard extends Sprite {
  private _imageScale: number;

  constructor(
    width: number,
    height: number,
    imageScale: number = 1,
    option?: {}
  ) {
    super();
    this._imageScale = imageScale;
    this.init(width, height);
  }

  protected init(width: number, height: number): void {
    const texture = new CanvasTexture(width, height);
    texture.minFilter = LinearFilter;
    this.material = new SpriteMaterial({
      map: texture,
      blending: NormalBlending,
      depthTest: false,
      transparent: true
    });

    this.updateScale();
  }

  get imageScale(): number {
    return this._imageScale;
  }

  set imageScale(value: number) {
    this._imageScale = value;
    this.updateScale();
  }

  private updateScale(): void {
    const map: CanvasTexture = <CanvasTexture>this.material.map;
    this.scale.set(
      map.width * this._imageScale,
      map.height * this._imageScale,
      1
    );
  }

  public changeMapVisible(val: boolean): void {
    if (this.visible === val) {
      return;
    }
    this.visible = val;
    const map: CanvasTexture = <CanvasTexture>this.material.map;

    console.log(this.material);

    if (map == null) return;

    if (this.visible) {
      map.start();
    } else {
      map.stop();
    }
  }
}
