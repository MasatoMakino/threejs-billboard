import {
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three";
import { InitializedBillBoardOptions } from "./BillBoard.js";

export type BillBoardMaterial = MeshBasicMaterial | SpriteMaterial;
export type BillBoardObject3D = Mesh | Sprite;

/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
export class BillBoardController {
  protected _imageScale: number;
  protected _target: Mesh | Sprite;
  private isInitGeometry: boolean = false;
  readonly textureLoaderPromise: Promise<void | ErrorEvent>;

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
    option: InitializedBillBoardOptions,
  ) {
    this._target = target;
    this._imageScale = imageScale;
    this.initDummyPlane(target);

    const mat = this.getMaterial(target);
    mat.visible = false;
    this._target.material = mat;

    this.textureLoaderPromise = new Promise((resolve, reject) => {
      new TextureLoader().load(
        url,
        (texture) => {
          texture.minFilter = option.minFilter;
          texture.colorSpace = "srgb";
          mat.map = texture;
          mat.needsUpdate = true;
          mat.visible = true;
          this.updateScale();
          resolve();
        },
        undefined,
        (e) => {
          reject(e);
        },
      );
    });
  }

  private getMaterial(
    target: BillBoardObject3D,
  ): MeshBasicMaterial | SpriteMaterial {
    const param = {
      blending: NormalBlending,
      depthTest: true,
      transparent: true,
    };
    if (target instanceof Mesh) {
      return new MeshBasicMaterial(param);
    }
    return new SpriteMaterial(param);
  }
  private initDummyPlane(target: BillBoardObject3D): void {
    if (target instanceof Mesh) {
      const size = 0.0000001;
      target.geometry = new PlaneGeometry(size, size);
    }
  }
  private initGeometry(image: HTMLImageElement) {
    if (!(this._target instanceof Mesh)) return;
    if (this.isInitGeometry) return;

    this._target.geometry = new PlaneGeometry(image.width, image.height);
    this.isInitGeometry = true;
  }

  /**
   * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
   */
  private updateScale = () => {
    const map = (this._target.material as BillBoardMaterial).map;
    if (map == null || map.image == null) return;
    const img = map.image as HTMLImageElement;

    this.initGeometry(img);
    const scale = this.calculateScale(img);

    this._target.scale.set(scale.x, scale.y, 1);
  };

  private calculateScale(img: HTMLImageElement): { x: number; y: number } {
    if (this._target instanceof Sprite) {
      return {
        x: img.width * this._imageScale,
        y: img.height * this._imageScale,
      };
    }

    return {
      x: this._imageScale,
      y: this._imageScale,
    };
  }

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
