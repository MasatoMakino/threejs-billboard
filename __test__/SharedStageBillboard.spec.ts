import { SharedStageBillboard, SharedStageTexture } from "../src/index.js";
import { Sprite, SpriteMaterial } from "three";
import { describe, expect, it } from "vitest";
import {
  textureArea,
  testUpdateTextureAreaAndUV,
} from "./SharedStageObject3D.js";

describe("SharedStageBillboard", () => {
  const generateBillboard = async () => {
    const texture = new SharedStageTexture();
    await texture.init(textureArea.width, textureArea.height);
    const material = new SpriteMaterial({ map: texture });
    const billboard = new SharedStageBillboard(material, textureArea);
    return billboard;
  };

  it("should create SharedStageBillboard instance successfully", async () => {
    const billboard = await generateBillboard();
    expect(billboard).toBeInstanceOf(Sprite);
  });

  /**
   * SharedStageBillboardはSpriteのデフォルトgeometryを使用せず、PlaneGeometryを使用している。
   * UV座標の更新処理を共有化するため。
   *
   * SpriteとPlaneGeometryは、頂点のインデックスが異なる。
   */
  it("should set correct position and uv attributes upon SharedStageBillboard creation", async () => {
    const billboard = await generateBillboard();

    const position = billboard.geometry.getAttribute("position");
    const uv = billboard.geometry.getAttribute("uv");
    const checkAttribute = (index: number, x: number, y: number) => {
      expect(position.getX(index)).toEqual(x - 0.5);
      expect(position.getY(index)).toEqual(y - 0.5);
      expect(uv.getX(index)).toEqual(x);
      expect(uv.getY(index)).toEqual(y);
    };
    checkAttribute(0, 0, 1);
    checkAttribute(1, 1, 1);
    checkAttribute(2, 0, 0);
    checkAttribute(3, 1, 0);
  });

  it.fails(
    "should throw an error when creating SharedStageBillboard without SharedStageTexture",
    () => {
      const material = new SpriteMaterial();
      new SharedStageBillboard(material, textureArea);
    },
  );

  it.fails(
    "should throw an error when updating texture area with material that does not have SharedStageTexture map",
    async () => {
      const billboard = await generateBillboard();
      billboard.sharedMaterial = new SpriteMaterial();
      billboard.updateTextureAreaAndUV(textureArea);
    },
  );

  it("should correctly update UV coordinates when texture area changes on shared canvas", async () => {
    const billboard = await generateBillboard();
    testUpdateTextureAreaAndUV(billboard);
  });

  it("should scale billboard dimensions proportionally when imageScale property changes", async () => {
    const billboard = await generateBillboard();

    const scale = 2.0;
    billboard.imageScale = scale;
    expect(billboard.imageScale).toEqual(scale);
    expect(billboard.scale.x).toEqual(textureArea.width * scale);
    expect(billboard.scale.y).toEqual(textureArea.height * scale);
    expect(billboard.scale.z).toEqual(1);
  });

  it("should not share UV attribute updates between different SharedStageBillboards", async () => {
    const billboard01 = await generateBillboard();
    const billboard02 = await generateBillboard();
    billboard01.updateTextureAreaAndUV(textureArea);

    const getUV = (billboard: Sprite) => {
      return billboard.geometry.getAttribute("uv");
    };
    expect(getUV(billboard01)).not.toEqual(getUV(billboard02));
  });
});
