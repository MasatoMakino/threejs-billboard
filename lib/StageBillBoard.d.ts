import {Sprite} from "three";
import Container = PIXI.Container;

export declare class StageBillBoard extends Sprite {
    private _imageScale;
    constructor(width: number, height: number, imageScale?: number, option?: {});
    private initTexture;
    get imageScale(): number;
    /**
     * 画像のスケールを指定する。
     *
     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
     *
     * @param value
     */
    set imageScale(value: number);
    /**
     * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
     */
    private updateScale;
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param visible
     */
    setVisible(visible: boolean): void;
    private getMap;
    get stage(): Container;
    setNeedUpdate(): void;
}
//# sourceMappingURL=StageBillBoard.d.ts.map