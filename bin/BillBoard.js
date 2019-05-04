import { Sprite, SpriteMaterial, TextureLoader, NormalBlending } from "three";
export class BillBoard extends Sprite {
    constructor(url, imageScale, option) {
        super();
        this.onLoadTexture = () => {
            this.material = new SpriteMaterial({
                map: this.texture,
                blending: NormalBlending,
                depthTest: true,
                transparent: true
            });
            const img = this.texture.image;
            this.scale.set(img.width * this.imageScale, img.height * this.imageScale, 1);
        };
        this.url = url;
        this.imageScale = imageScale;
        this.texture = new TextureLoader().load(this.url, this.onLoadTexture);
    }
}
