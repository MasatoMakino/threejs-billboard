import { SharedStageBillboard, SharedStageTexture } from "../src/index.js";
import { type Sprite, SpriteMaterial } from "three";
import { describe, expect, it } from "vitest";
import { textureArea } from "./SharedStageObject3D.js";

describe("SharedStageBillboard", () => {
  const generateBillboard = async () => {
    const texture = new SharedStageTexture();
    await texture.init(textureArea.width, textureArea.height);
    const material = new SpriteMaterial({ map: texture });
    const billboard = new SharedStageBillboard(material, textureArea);
    return billboard;
  };

  /**
   * SharedStageBillboardはSpriteのデフォルトgeometryを使用せず、PlaneGeometryを使用している。
   * UV座標の更新処理を共有化するため。
   *
   * SpriteとPlaneGeometryは、頂点のインデックスが異なる。
   */
  it("maps the texture area onto the PlaneGeometry vertex order, so that the sprite shows the area upright", async () => {
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

  it("rejects a material without SharedStageTexture, because UVs are computed from the shared texture size", () => {
    const material = new SpriteMaterial();
    expect(() => new SharedStageBillboard(material, textureArea)).toThrow(
      "sharedMaterial.map must be SharedStageTexture",
    );
  });

  it("rejects a texture area update after sharedMaterial is replaced by one without SharedStageTexture, because UVs are computed from the shared texture size", async () => {
    const billboard = await generateBillboard();
    billboard.sharedMaterial = new SpriteMaterial();
    expect(() => billboard.updateTextureAreaAndUV(textureArea)).toThrow(
      "sharedMaterial.map must be SharedStageTexture",
    );
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

  it("keeps UVs per billboard, so that updating the texture area of one billboard does not move the image of another", async () => {
    const billboard01 = await generateBillboard();
    const billboard02 = await generateBillboard();
    billboard01.updateTextureAreaAndUV({
      ...textureArea,
      width: textureArea.width / 2,
      height: textureArea.height / 2,
    });

    const getUV = (billboard: Sprite) => {
      return Array.from(billboard.geometry.getAttribute("uv").array);
    };
    expect(getUV(billboard01)).not.toEqual(getUV(billboard02));
  });
});
