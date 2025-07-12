import { SharedStageTexture, SharedStagePlaneMesh } from "../src/index.js";
import { MeshBasicMaterial } from "three";
import { describe, it, expect } from "vitest";
import {
  textureArea,
  testUpdateTextureAreaAndUV,
} from "./SharedStageObject3D.js";

describe("SharedStagePlaneMesh", () => {
  const generateSharedStagePlaneMesh = async () => {
    const texture = new SharedStageTexture();
    await texture.init(32, 32);
    const material = new MeshBasicMaterial({ map: texture });
    const plane = new SharedStagePlaneMesh(material, textureArea);
    return plane;
  };

  it("should create SharedStagePlaneMesh instance successfully", async () => {
    const plane = await generateSharedStagePlaneMesh();
    expect(plane).toBeInstanceOf(SharedStagePlaneMesh);
  });

  it.fails(
    "should throw an error when to create a SharedStagePlaneMesh without SharedStageTexture",
    () => {
      const material = new MeshBasicMaterial();
      new SharedStagePlaneMesh(material, textureArea);
    },
  );

  it.fails(
    "should throw an error when updating texture area with a material that has not a map of SharedStageTexture",
    async () => {
      const plane = await generateSharedStagePlaneMesh();
      plane.sharedMaterial = new MeshBasicMaterial();
      plane.updateTextureAreaAndUV(textureArea);
    },
  );

  it("should correctly update UV coordinates when texture area changes", async () => {
    const plane = await generateSharedStagePlaneMesh();
    testUpdateTextureAreaAndUV(plane);
  });
});
