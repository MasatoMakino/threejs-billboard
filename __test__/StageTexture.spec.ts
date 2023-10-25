import { StageTexture } from "../src/index.js";
import { Ticker, Container, Graphics, ICanvas } from "pixi.js-legacy";
import { describe, expect, test, beforeAll } from "vitest";

describe("StageTexture", () => {
  beforeAll(() => {
    Ticker.shared.update(0);
  });

  const SIZE = 16;
  const draw = (stage: Container, color: string) => {
    stage.removeChildren();

    const g = new Graphics()
      .beginFill(color)
      .drawRect(0, 0, SIZE, SIZE)
      .endFill();
    stage.addChild(g);
  };

  const getPixelColor = (view: ICanvas) => {
    const context = view.getContext("2d");
    if (!context) {
      throw new Error(
        "Canvas2d context initialization failed. Canvas is not supported in this test run environment. Please install the canvas package from npm.",
      );
    }

    const pixel = context.getImageData(SIZE / 2, SIZE / 2, 1, 1);
    const data = pixel.data;

    const rgbToHex = (r: number, g: number, b: number) =>
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");

    return rgbToHex(data[0], data[1], data[2]);
  };

  test("constructor", () => {
    const texture = new StageTexture(SIZE, SIZE);
    expect(texture).not.toBeUndefined();
    expect(texture.stage).toBeTruthy();
    expect(texture.domElement).toBeTruthy();
  });

  test("update stage", () => {
    const texture = new StageTexture(SIZE, SIZE);
    expect(getPixelColor(texture.domElement)).toBe("#000000");
    Ticker.shared.update(100);

    draw(texture.stage, "#ff0000");
    texture.setNeedUpdate();
    Ticker.shared.update(200);
    expect(getPixelColor(texture.domElement)).toBe("#ff0000");
  });

  test("Stopped textures should not be updated", () => {
    const texture = new StageTexture(SIZE, SIZE);
    draw(texture.stage, "#ff0000");
    texture.setNeedUpdate();
    Ticker.shared.update(1000);
    expect(getPixelColor(texture.domElement)).toBe("#ff0000");

    texture.start();
    texture.setNeedUpdate();
    Ticker.shared.update(2000);
    expect(getPixelColor(texture.domElement)).toBe("#ff0000");

    texture.stop();
    draw(texture.stage, "#00ff00");
    texture.setNeedUpdate();
    Ticker.shared.update(3000);
    expect(getPixelColor(texture.domElement)).toBe("#ff0000");
  });
});
