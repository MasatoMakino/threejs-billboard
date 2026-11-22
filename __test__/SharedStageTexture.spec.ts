import { describe, it, expect, vi } from "vitest";
import { SharedStageTexture } from "../src/index.js";
import { Ticker } from "pixi.js";

describe("SharedStageTexture", () => {
  it("init sizes the texture to the requested width and height, so that texture areas map to UVs in pixels", async () => {
    const texture = new SharedStageTexture();
    await texture.init(256, 128);

    expect(texture.width).toBe(256);
    expect(texture.height).toBe(128);
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
