import { Sprite, Texture } from "three";
export declare class BillBoard extends Sprite {
    url: string;
    private _imageScale;
    texture: Texture;
    constructor(url: string, imageScale: number, option?: {});
    private onLoadTexture;
    private updateScale;
    imageScale: number;
}
//# sourceMappingURL=BillBoard.d.ts.map