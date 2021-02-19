import { Mesh, MeshBasicMaterial, Sprite, SpriteMaterial } from "three";
import { BillBoardOptions } from "./BillBoard";
export declare type BillBoardMaterial = MeshBasicMaterial | SpriteMaterial;
export declare type BillBoardObject3D = Mesh | Sprite;
/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
export declare class BillBoardController {
    protected _imageScale: number;
    protected _target: Mesh | Sprite;
    private isInitGeometry;
    /**
     * コンストラクタ
     * @param target
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(target: BillBoardObject3D, url: string, imageScale: number, option: BillBoardOptions);
    private getMaterial;
    private initDummyPlane;
    private initGeometry;
    /**
     * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
     */
    private updateScale;
    private calculateScale;
    get imageScale(): number;
    /**
     * 画像のスケールを指定する。
     *
     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
     *
     * @param value
     */
    set imageScale(value: number);
}
//# sourceMappingURL=BillBoardController.d.ts.map