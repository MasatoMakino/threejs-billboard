import { ScaleCalculator } from "../src/index.js";
import { PerspectiveCamera } from "three";
import { describe, expect, test } from "vitest";

describe("ScaleCalculator", () => {
  test("should calculate correct non-attenuation scale for pixel-perfect rendering at given camera distance", () => {
    const H = 480;
    const W = 640;
    const camera = new PerspectiveCamera(45, W / H, 1, 400);
    camera.position.set(0, 0, 100);
    const scale = ScaleCalculator.getNonAttenuateScale(H, camera);
    expect(scale).toBeCloseTo(0.0017258898432212294);
  });

  describe("Edge Cases", () => {
    test("should handle extreme FOV values without overflow", () => {
      const camera = new PerspectiveCamera();
      const rendererHeight = 1080;

      // Test very wide FOV (near maximum)
      camera.fov = 179;
      camera.updateProjectionMatrix();
      const wideScale = ScaleCalculator.getNonAttenuateScale(
        rendererHeight,
        camera,
      );
      expect(Number.isFinite(wideScale)).toBe(true);
      expect(wideScale).toBeGreaterThan(0);
      expect(wideScale).toBeLessThan(1000);

      // Test very narrow FOV (near minimum)
      camera.fov = 0.1;
      camera.updateProjectionMatrix();
      const narrowScale = ScaleCalculator.getNonAttenuateScale(
        rendererHeight,
        camera,
      );
      expect(Number.isFinite(narrowScale)).toBe(true);
      expect(narrowScale).toBeGreaterThan(0);
      expect(narrowScale).toBeLessThan(1);
    });

    test("should handle extreme renderer dimensions", () => {
      const camera = new PerspectiveCamera(75);
      camera.updateProjectionMatrix();

      // Test very large renderer height
      const largeScale = ScaleCalculator.getNonAttenuateScale(8192, camera);
      expect(Number.isFinite(largeScale)).toBe(true);
      expect(largeScale).toBeGreaterThan(0);

      // Test very small renderer height
      const smallScale = ScaleCalculator.getNonAttenuateScale(1, camera);
      expect(Number.isFinite(smallScale)).toBe(true);
      expect(smallScale).toBeGreaterThan(0);
      expect(smallScale).toBeGreaterThan(largeScale);
    });

    test("should handle standard display resolutions accurately", () => {
      const camera = new PerspectiveCamera(75);
      camera.updateProjectionMatrix();

      const commonResolutions = [
        { width: 1920, height: 1080, name: "1080p" },
        { width: 2560, height: 1440, name: "1440p" },
        { width: 3840, height: 2160, name: "4K" },
        { width: 1366, height: 768, name: "laptop" },
        { width: 1280, height: 720, name: "720p" },
      ];

      for (const resolution of commonResolutions) {
        const scale = ScaleCalculator.getNonAttenuateScale(
          resolution.height,
          camera,
        );
        expect(Number.isFinite(scale)).toBe(true);
        expect(scale).toBeGreaterThan(0);
        expect(scale).toBeLessThan(1);
      }
    });

    test("should handle camera with uninitialized projection matrix", () => {
      const camera = new PerspectiveCamera();
      const scale = ScaleCalculator.getNonAttenuateScale(1080, camera);
      expect(Number.isFinite(scale)).toBe(true);
      expect(scale).toBeGreaterThan(0);
    });
  });
});
