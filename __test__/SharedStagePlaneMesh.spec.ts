import { SharedStageTexture, SharedStagePlaneMesh } from "../src/index.js";
import { MeshBasicMaterial } from "three";
import { describe, it, expect } from "vitest";
import { textureArea } from "./SharedStageObject3D.js";

describe("SharedStagePlaneMesh", () => {
  const generateSharedStagePlaneMesh = async () => {
    const texture = new SharedStageTexture();
    await texture.init(32, 32);
    const material = new MeshBasicMaterial({ map: texture });
    const plane = new SharedStagePlaneMesh(material, textureArea);
    return plane;
  };

  it("rejects a material without SharedStageTexture, because UVs are computed from the shared texture size", () => {
    const material = new MeshBasicMaterial();
    expect(() => new SharedStagePlaneMesh(material, textureArea)).toThrow(
      "sharedMaterial.map must be SharedStageTexture",
    );
  });

  it("rejects a texture area update after sharedMaterial is replaced by one without SharedStageTexture, because UVs are computed from the shared texture size", async () => {
    const plane = await generateSharedStagePlaneMesh();
    plane.sharedMaterial = new MeshBasicMaterial();
    expect(() => plane.updateTextureAreaAndUV(textureArea)).toThrow(
      "sharedMaterial.map must be SharedStageTexture",
    );
  });

  it("resizes the plane to a new texture area size, so that the area keeps its pixel aspect ratio", async () => {
    const plane = await generateSharedStagePlaneMesh();
    plane.updateTextureAreaAndUV({ x: 0, y: 0, width: 16, height: 8 });
    expect(plane.geometry.parameters).toMatchObject({ width: 16, height: 8 });
  });
});
