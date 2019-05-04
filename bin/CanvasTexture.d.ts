/// <reference types="easeljs" />
import { Texture } from "three";
export declare class CanvasTexture extends Texture {
    private _width;
    private _height;
    private _canvas;
    private _stage;
    private _needUpdateCanvas;
    private _renderID;
    constructor(width: number, height: number);
    protected init(): void;
    /**
     * レンダーループを開始する
     * メインのレンダーループで同上のイベントを必ず発効すること。
     */
    start(): void;
    stop(): void;
    protected update(): void;
    setNeedUpdate(): void;
    private render;
    readonly height: number;
    readonly width: number;
    readonly stage: createjs.Stage;
}
//# sourceMappingURL=CanvasTexture.d.ts.map