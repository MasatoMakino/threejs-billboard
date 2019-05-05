import {
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  NormalBlending
} from "three";

export class BillBoard extends Sprite {
  url: string;
  private _imageScale: number;
  texture: Texture;

  constructor(url: string, imageScale: number, option?: {}) {
    super();

    this.url = url;
    this._imageScale = imageScale;

    this.texture = new TextureLoader().load(this.url, this.onLoadTexture);
  }

  private onLoadTexture = () => {
    this.material = new SpriteMaterial({
      map: this.texture,
      blending: NormalBlending,
      depthTest: true,
      transparent: true
    });
    this.updateScale();
  };

  private updateScale(): void {
    if (this.texture == null || this.texture.image == null) return;
    const img = this.texture.image as HTMLImageElement;
    console.log( this._imageScale);
    this.scale.set(
      img.width * this._imageScale,
      img.height * this._imageScale,
      1
    );
  }

  get imageScale(): number {
    return this._imageScale;
  }

  set imageScale(value: number) {
    this._imageScale = value;
    this.updateScale();
  }
}
