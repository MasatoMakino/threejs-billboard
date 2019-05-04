import {
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  NormalBlending
} from "three";

export class BillBoard extends Sprite {
  url: string;
  imageScale: number;
  texture: Texture;

  constructor(url: string, imageScale: number, option?: {}) {
    super();

    this.url = url;
    this.imageScale = imageScale;

    this.texture = new TextureLoader().load(this.url, this.onLoadTexture);
  }

  private onLoadTexture = () => {
    this.material = new SpriteMaterial({
      map: this.texture,
      blending: NormalBlending,
      depthTest: true,
      transparent: true
    });
    const img = this.texture.image as HTMLImageElement;
    this.scale.set(
      img.width * this.imageScale,
      img.height * this.imageScale,
      1
    );
  };
}
