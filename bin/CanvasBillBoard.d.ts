import { Sprite } from "three";
export declare class CanvasBillBoard extends Sprite {
    private _imageScale;
    constructor(width: number, height: number, imageScale?: number, option?: {});
    protected init(width: number, height: number): void;
    imageScale: number;
    private updateScale;
    changeMapVisible(val: boolean): void;
}
//# sourceMappingURL=CanvasBillBoard.d.ts.map