import { describe, it, expect } from "vitest";
import { SharedStageTexture } from "../src/index.js";
import { Graphics, Ticker } from "pixi.js";

describe("SharedStageTexture", () => {
  it("should create an instance of SharedStageTexture with correct dimensions", async () => {
    const texture = new SharedStageTexture();
    await texture.init(256, 128);

    expect(texture).toBeTruthy();
    expect(texture).instanceOf(SharedStageTexture);
    expect(texture.width).toBe(256);
    expect(texture.height).toBe(128);
    expect(texture.image).toBeTruthy();
  });

  it("should correctly drawable Canvas pixels using SharedStageTexture", async () => {
    const w = 32;
    const h = 32;
    const texture = new SharedStageTexture();
    await texture.init(w, h);

    const g = new Graphics().rect(0, 0, w, h).fill(0xff0000);
    texture.stage.addChild(g);
    texture.setNeedUpdate();
    Ticker.shared.update();
  });
});
