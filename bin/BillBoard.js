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
            this.updateScale();
        };
        this.url = url;
        this._imageScale = imageScale;
        this.texture = new TextureLoader().load(this.url, this.onLoadTexture);
    }
    updateScale() {
        if (this.texture == null || this.texture.image == null)
            return;
        const img = this.texture.image;
        // console.log(this._imageScale);
        this.scale.set(img.width * this._imageScale, img.height * this._imageScale, 1);
    }
    get imageScale() {
        return this._imageScale;
    }
    set imageScale(value) {
        this._imageScale = value;
        this.updateScale();
    }
}
