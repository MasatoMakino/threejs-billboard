import { SharedStageTexture, SharedStagePlaneMesh } from "../src/index.js";
import { MeshBasicMaterial } from "three";
import { describe, it, expect } from "vitest";

describe("SharedStagePlaneMesh", () => {
  const generateSharedStagePlaneMesh = () => {
    const texture = new SharedStageTexture(32, 32);
    const material = new MeshBasicMaterial({ map: texture });
    const plane = new SharedStagePlaneMesh(material, {
      x: 0,
      y: 0,
      width: 32,
      height: 32,
    });
    return plane;
  };

  it("should be able to create a SharedStagePlaneMesh", () => {
    const plane = generateSharedStagePlaneMesh();
    expect(plane).toBeInstanceOf(SharedStagePlaneMesh);
  });

  it.fails(
    "should throw an error when to create a SharedStagePlaneMesh without SharedStageTexture",
    () => {
      const material = new MeshBasicMaterial();
      const plane = new SharedStagePlaneMesh(material, {
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
      const plane = generateSharedStagePlaneMesh();
      plane.sharedMaterial = new MeshBasicMaterial();

      plane.updateTextureAreaAndUV({
        x: 0,
        y: 0,
        width: 32,
        height: 32,
      });
    },
  );

  it("should be able to update texture area and uv", () => {
    const plane = generateSharedStagePlaneMesh();
    const area = {
      x: 0,
      y: 0,
      width: 16,
      height: 16,
    };
    plane.updateTextureAreaAndUV(area);
    expect(plane.cloneTextureArea()).toEqual(area);
  });
});
