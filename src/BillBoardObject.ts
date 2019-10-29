import { TextureLoader } from "three";
import { SpriteMaterial } from "three";
import { NormalBlending } from "three";
import { Mesh, Sprite } from "three";
import { MeshBasicMaterial } from "three";

export type BillBoardMaterial = MeshBasicMaterial | SpriteMaterial;
export type BillBoardObject3D = Mesh | Sprite;

/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
export class BillBoardObject {
  protected _imageScale: number;
  protected _target: Mesh | Sprite;

  /**
   * コンストラクタ
   * @param target
   * @param url テクスチャー画像ファイルのURL
   * @param imageScale
   * @param option
   */
  constructor(
    target: BillBoardObject3D,
    url: string,
    imageScale: number,
    option?: {}
  ) {
    this._target = target;
    this._imageScale = imageScale;
    const texture = new TextureLoader().load(url, this.updateScale);

    this._target.material = new SpriteMaterial({
      map: texture,
      blending: NormalBlending,
      depthTest: true,
      transparent: true
    });
  }

  /**
   * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
   */
  private updateScale = () => {
    const map = (this._target.material as BillBoardMaterial).map;
    if (map == null || map.image == null) return;

    const img = map.image as HTMLImageElement;
    this._target.scale.set(
      img.width * this._imageScale,
      img.height * this._imageScale,
      1
    );
  };

  get imageScale(): number {
    return this._imageScale;
  }

  /**
   * 画像のスケールを指定する。
   *
   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
   *
   * @param value
   */
  set imageScale(value: number) {
    this._imageScale = value;
    this.updateScale();
  }
}
