import { CameraChaser } from "../src/index.js";
import {
  type BufferGeometry,
  type Group,
  type Material,
  Object3D,
  PerspectiveCamera,
  type Scene,
  Vector3,
  type WebGLRenderer,
} from "three";
import { describe, expect, test } from "vitest";

describe("CameraChaser", () => {
  test("should correctly rotate object to face camera horizontally", () => {
    const camera = new PerspectiveCamera(45, 1, 1, 1000);

    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);
    cameraChaser.isLookingCameraHorizontal = true;
    cameraChaser.needUpdateWorldPosition = true;

    const testRotation = (cameraPosition: Vector3, rotation: Vector3) => {
      camera.position.copy(cameraPosition);

      target.onBeforeRender(
        {} as unknown as WebGLRenderer, // renderer
        {} as unknown as Scene, // scene
        camera,
        {} as unknown as BufferGeometry, // geometry
        {} as unknown as Material, // material
        {} as unknown as Group, // group
      );
      expect(target.rotation.x).toBeCloseTo(rotation.x);
      expect(target.rotation.y).toBeCloseTo(rotation.y);
      expect(target.rotation.z).toBeCloseTo(rotation.z);
    };

    testRotation(new Vector3(0, 0, 10), new Vector3(0, 0, 0));
    testRotation(new Vector3(10, 0, 10), new Vector3(0, Math.PI / 4, 0));
  });

  test("should restore original onBeforeRender callback on dispose", () => {
    const target = new Object3D();

    const originalCallback = () => {
      // Original callback behavior
    };
    target.onBeforeRender = originalCallback;

    const cameraChaser = new CameraChaser(target);
    expect(target.onBeforeRender).not.toBe(originalCallback);

    cameraChaser.dispose();
    expect(target.onBeforeRender).toBe(originalCallback);
  });

  test("dispose is idempotent, so that a second call does not overwrite the restored onBeforeRender", () => {
    const target = new Object3D();
    const originalCallback = target.onBeforeRender;

    const cameraChaser = new CameraChaser(target);

    cameraChaser.dispose();
    expect(target.onBeforeRender).toBe(originalCallback);

    expect(() => {
      cameraChaser.dispose();
    }).not.toThrow();

    expect(target.onBeforeRender).toBe(originalCallback);
  });
});
