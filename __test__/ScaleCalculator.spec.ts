import { ScaleCalculator } from "../src/index.js";
import { PerspectiveCamera } from "three";
import { describe, expect, test } from "vitest";

describe("ScaleCalculator", () => {
  test("returns the world size of one screen pixel at distance 1, so that a sprite without size attenuation shows one image pixel per screen pixel", () => {
    const H = 480;
    const W = 640;
    const camera = new PerspectiveCamera(45, W / H, 1, 400);
    camera.position.set(0, 0, 100);
    const scale = ScaleCalculator.getNonAttenuateScale(H, camera);
    expect(scale).toBeCloseTo(0.0017258898432212294);
  });

  describe("Edge Cases", () => {
    test("scale decreases as renderer height grows, so that one image pixel keeps mapping to one screen pixel", () => {
      const camera = new PerspectiveCamera(75);
      camera.updateProjectionMatrix();

      // Test very large renderer height
      const largeScale = ScaleCalculator.getNonAttenuateScale(8192, camera);

      // Test very small renderer height
      const smallScale = ScaleCalculator.getNonAttenuateScale(1, camera);
      expect(smallScale).toBeGreaterThan(largeScale);
    });
  });
});
