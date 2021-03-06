import { LinearFilter, NormalBlending, Sprite, SpriteMaterial } from "three";
import { StageObject3D } from "./StageObject3D";
import { StageTexture } from "./StageTexture";
import { Container } from "pixi.js";

export class StageBillBoard extends Sprite {
  private _imageScale: number;

  constructor(
    width: number,
    height: number,
    imageScale: number = 1,
    option?: {}
  ) {
    super();
    this._imageScale = imageScale;
    this.initTexture(width, height, option);
  }

  private initTexture(width: number, height: number, option?: {}): void {
    const texture = new StageTexture(width, height);
    texture.minFilter = LinearFilter;
    this.material = new SpriteMaterial({
      map: texture,
      blending: NormalBlending,
      depthTest: false,
      transparent: true,
    });

    this.updateScale();
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

  /**
   * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
   */
  private updateScale(): void {
    const map: StageTexture = <StageTexture>this.material.map;
    const canvas = map.domElement;
    this.scale.set(
      canvas.width * this._imageScale,
      canvas.height * this._imageScale,
      1
    );
  }

  /**
   * オブジェクトの表示/非表示を設定する。
   * 設定に応じてテクスチャの更新を停止/再開する。
   * @param visible
   */
  public setVisible(visible: boolean): void {
    StageObject3D.setVisible(this, visible);
  }

  private getMap(): StageTexture {
    return this.material.map as StageTexture;
  }

  get stage(): Container {
    return this.getMap().stage;
  }

  public setNeedUpdate(): void {
    this.getMap().setNeedUpdate();
  }
}
