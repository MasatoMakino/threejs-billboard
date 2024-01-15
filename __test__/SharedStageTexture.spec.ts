import { describe, it, expect } from "vitest";
import { SharedStageTexture } from "../src/index.js";
import { Graphics, Ticker } from "pixi.js";

describe("SharedStageTexture", () => {
  it("should create an instance of SharedStageTexture with correct dimensions", async () => {
    const texture = new SharedStageTexture(256, 128);

    expect(texture).toBeTruthy();
    expect(texture).instanceOf(SharedStageTexture);
    expect(texture.width).toBe(256);
    expect(texture.height).toBe(128);
    expect(texture.image).toBeTruthy();
  });

  it("should correctly manipulate Canvas pixels using SharedStageTexture", async () => {
    const w = 32;
    const h = 32;
    const texture = new SharedStageTexture(w, h);

    const g = new Graphics().beginFill(0xff0000).drawRect(0, 0, w, h).endFill();
    texture.stage.addChild(g);
    texture.setNeedUpdate();
    Ticker.shared.update();

    const image = texture.image as HTMLCanvasElement;
    const ctx = image.getContext("2d");
    const data = ctx!.getImageData(16, 16, 1, 1).data;
    expect(Array.from(data)).toEqual([255, 0, 0, 255]);
  });
});
