/// <reference types="easeljs" />
import { Texture } from "three";
export declare class StageTexture extends Texture {
    private _stage;
    private _needUpdateCanvas;
    private isStart;
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
    get stage(): createjs.Stage;
}
//# sourceMappingURL=StageTexture.d.ts.map