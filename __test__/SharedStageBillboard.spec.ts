import { SharedStageBillboard, SharedStageTexture } from "../src/index.js";
import { Sprite, SpriteMaterial } from "three";
import { describe, expect, it } from "vitest";

describe("SharedStageBillboard", () => {
  const generateBillboard = () => {
    const texture = new SharedStageTexture(32, 32);
    const material = new SpriteMaterial({ map: texture });
    const billboard = new SharedStageBillboard(material, {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
    });
    return billboard;
  };
  it("should be able to create a SharedStageBillboard", () => {
    const billboard = generateBillboard();

    expect(billboard).toBeInstanceOf(Sprite);
  });

  it.fails(
    "should throw an error when to create a SharedStageBillboard without SharedStageTexture",
    () => {
      const material = new SpriteMaterial();
      const billboard = new SharedStageBillboard(material, {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
      });
    },
  );

  it.fails(
    "should throw an error when updating texture area with a material that has not a map of SharedStageTexture",
    () => {
      const billboard = generateBillboard();
      billboard.sharedMaterial = new SpriteMaterial();

      billboard.updateTextureAreaAndUV({
        x: 0,
        y: 0,
        width: 32,
        height: 32,
      });
    },
  );

  it("should be able to update texture area", () => {
    const billboard = generateBillboard();

    const area = {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    };
    billboard.updateTextureAreaAndUV(area);
    expect(billboard.cloneTextureArea()).toEqual(area);
  });

  it("should be able to update image scale", () => {
    const billboard = generateBillboard();

    const scale = 2.0;
    billboard.imageScale = scale;
    expect(billboard.imageScale).toEqual(scale);
    expect(billboard.scale.x).toEqual(32 * scale);
    expect(billboard.scale.y).toEqual(32 * scale);
    expect(billboard.scale.z).toEqual(1);
  });
});
