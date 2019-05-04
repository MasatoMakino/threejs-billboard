import { Texture } from "three";
import Stage = createjs.Stage;
import { LinearFilter } from "three";

export class CanvasTexture extends Texture {
  private _width: number;
  private _height: number;
  private _canvas: HTMLCanvasElement;
  private _stage: Stage;
  private _needUpdateCanvas: boolean;
  private _renderID;

  constructor(width: number, height: number) {
    super();
    this._width = width;
    this._height = height;
    this.init();
  }

  protected init(): void {
    this._canvas = document.createElement("canvas");
    this._canvas.width = this._width;
    this._canvas.height = this._height;

    this.image = this._canvas;
    this.minFilter = LinearFilter;

    this._stage = new createjs.Stage(this._canvas);
    this._stage.enableDOMEvents(false);
    this.start();
  }

  /**
   * レンダーループを開始する
   * メインのレンダーループで同上のイベントを必ず発効すること。
   */
  public start(): void {
    if (this._renderID != null) return;
    this._renderID = requestAnimationFrame(this.render);
  }

  public stop(): void {
    if (this._renderID == null) return;
    cancelAnimationFrame(this._renderID);
    this._renderID = null;
  }

  protected update(): void {
    this._stage.update();
    this.needsUpdate = true;
  }

  public setNeedUpdate(): void {
    this._needUpdateCanvas = true;
  }

  private render = (e?: any) => {
    if (this._needUpdateCanvas) {
      this.update();
      this._needUpdateCanvas = false;
    }
    this._renderID = requestAnimationFrame(this.render);
  };

  get height(): number {
    return this._height;
  }
  get width(): number {
    return this._width;
  }
  get stage(): createjs.Stage {
    return this._stage;
  }
}
