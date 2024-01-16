import { SharedStageBillboard, SharedStageTexture } from "../src/index.js";
import { Sprite, SpriteMaterial } from "three";
import { describe, expect, it } from "vitest";
import {
  textureArea,
  testUpdateTextureAreaAndUV,
} from "./SharedStageObject3D.js";

describe("SharedStageBillboard", () => {
  const generateBillboard = () => {
    const texture = new SharedStageTexture(
      textureArea.width,
      textureArea.height,
    );
    const material = new SpriteMaterial({ map: texture });
    const billboard = new SharedStageBillboard(material, textureArea);
    return billboard;
  };

  it("should be able to create a SharedStageBillboard", () => {
    const billboard = generateBillboard();
    expect(billboard).toBeInstanceOf(Sprite);
  });

  it("should set correct position and uv attributes upon SharedStageBillboard creation", () => {
    const billboard = generateBillboard();
    const position = billboard.geometry.getAttribute("position");
    expect(position.getX(0)).toEqual(-0.5);
    expect(position.getY(0)).toEqual(0.5);
    expect(position.getX(1)).toEqual(0.5);
    expect(position.getY(1)).toEqual(0.5);
    expect(position.getX(2)).toEqual(-0.5);
    expect(position.getY(2)).toEqual(-0.5);
    expect(position.getX(3)).toEqual(0.5);
    expect(position.getY(3)).toEqual(-0.5);

    const uv = billboard.geometry.getAttribute("uv");
    expect(uv.getX(0)).toEqual(0);
    expect(uv.getY(0)).toEqual(1);
    expect(uv.getX(1)).toEqual(1);
    expect(uv.getY(1)).toEqual(1);
    expect(uv.getX(2)).toEqual(0);
    expect(uv.getY(2)).toEqual(0);
    expect(uv.getX(3)).toEqual(1);
    expect(uv.getY(3)).toEqual(0);
  });

  it.fails(
    "should throw an error when to create a SharedStageBillboard without SharedStageTexture",
    () => {
      const material = new SpriteMaterial();
      const billboard = new SharedStageBillboard(material, textureArea);
    },
  );

  it.fails(
    "should throw an error when updating texture area with a material that has not a map of SharedStageTexture",
    () => {
      const billboard = generateBillboard();
      billboard.sharedMaterial = new SpriteMaterial();
      billboard.updateTextureAreaAndUV(textureArea);
    },
  );

  it("should be able to update texture area", () => {
    const billboard = generateBillboard();
    testUpdateTextureAreaAndUV(billboard);
  });

  it("should be able to update image scale", () => {
    const billboard = generateBillboard();

    const scale = 2.0;
    billboard.imageScale = scale;
    expect(billboard.imageScale).toEqual(scale);
    expect(billboard.scale.x).toEqual(textureArea.width * scale);
    expect(billboard.scale.y).toEqual(textureArea.height * scale);
    expect(billboard.scale.z).toEqual(1);
  });

  it("should not share UV attribute updates between different SharedStageBillboards", () => {
    const billboard01 = generateBillboard();
    const billboard02 = generateBillboard();
    billboard01.updateTextureAreaAndUV(textureArea);

    const getUV = (billboard: Sprite) => {
      return billboard.geometry.getAttribute("uv");
    };
    expect(getUV(billboard01)).not.toEqual(getUV(billboard02));
  });
});
