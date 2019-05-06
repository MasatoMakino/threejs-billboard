/// <reference types="easeljs" />
import { Texture } from "three";
export declare class CanvasTexture extends Texture {
    private _stage;
    private _needUpdateCanvas;
    private _renderID;
    constructor(width: number, height: number);
    protected init(width: number, height: number): void;
    /**
     * テクスチャの更新を開始する
     */
    start(): void;
    /**
     * テクスチャの更新を停止する
     */
    stop(): void;
    protected update(): void;
    setNeedUpdate(): void;
    private onRequestFrame;
    /**
     * このテクスチャに紐づけられたcreatejs.stageインスタンスを取得する。
     * カンバスへはstage.canvasでアクセスする。
     */
    readonly stage: createjs.Stage;
}
//# sourceMappingURL=CanvasTexture.d.ts.map