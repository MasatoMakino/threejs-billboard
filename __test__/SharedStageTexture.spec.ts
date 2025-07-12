import { describe, it, expect, vi } from "vitest";
import { SharedStageTexture } from "../src/index.js";
import { Graphics, Ticker } from "pixi.js";

describe("SharedStageTexture", () => {
  it("should initialize with correct dimensions", async () => {
    const texture = new SharedStageTexture();
    await texture.init(256, 128);

    expect(texture).toBeTruthy();
    expect(texture).instanceOf(SharedStageTexture);
    expect(texture.width).toBe(256);
    expect(texture.height).toBe(128);
    expect(texture.image).toBeTruthy();
  });

  it("should render Canvas pixels correctly using SharedStageTexture", async () => {
    const w = 32;
    const h = 32;
    const texture = new SharedStageTexture();
    await texture.init(w, h);

    const g = new Graphics().rect(0, 0, w, h).fill(0xff0000);
    texture.stage.addChild(g);
    texture.setNeedUpdate();
    Ticker.shared.update();
  });

  it("should only update the texture once regardless of multiple setNeedUpdates calls", async () => {
    const texture = new SharedStageTexture();
    await texture.init(32, 32);
    const renderer = vi.spyOn(texture.app.renderer, "render");

    texture.setNeedUpdate();
    texture.setNeedUpdate();
    texture.setNeedUpdate();

    Ticker.shared.update();

    expect(renderer).toHaveBeenCalledTimes(1);
  });

  it("should only update the texture once regardless of multiple Ticker.update calls", async () => {
    const texture = new SharedStageTexture();
    await texture.init(32, 32);
    const renderer = vi.spyOn(texture.app.renderer, "render");

    texture.setNeedUpdate();
    Ticker.shared.update();
    Ticker.shared.update();
    Ticker.shared.update();

    expect(renderer).toHaveBeenCalledTimes(1);
  });

  it("should not update the texture without setNeedUpdate()", async () => {
    const texture = new SharedStageTexture();
    await texture.init(32, 32);
    const renderer = vi.spyOn(texture.app.renderer, "render");

    Ticker.shared.update();
    expect(renderer).toHaveBeenCalledTimes(0);
  });
});
