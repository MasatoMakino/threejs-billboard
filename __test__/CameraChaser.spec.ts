import { CameraChaser } from "../src/index.js";
import {
  type BufferGeometry,
  Group,
  type Material,
  Object3D,
  PerspectiveCamera,
  type Scene,
  Vector3,
  type WebGLRenderer,
} from "three";
import { describe, expect, test } from "vitest";

// Helper function to access private target property for testing
const getPrivateTarget = (cameraChaser: CameraChaser): Object3D | undefined => {
  // biome-ignore lint/suspicious/noExplicitAny: Accessing private property for testing
  return (cameraChaser as any).target;
};

describe("CameraChaser", () => {
  test("should initialize CameraChaser and set up onBeforeRender callback for camera tracking", () => {
    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);
    expect(cameraChaser).not.toBeUndefined();
    expect(target.onBeforeRender).not.toBeUndefined();
  });

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

    // Set up an original onBeforeRender callback
    const originalCallback = () => {
      // Original callback behavior
    };
    target.onBeforeRender = originalCallback;

    // Create CameraChaser - this should replace the onBeforeRender
    const cameraChaser = new CameraChaser(target);
    expect(target.onBeforeRender).not.toBe(originalCallback);

    // Dispose should restore the original callback
    cameraChaser.dispose();
    expect(target.onBeforeRender).toBe(originalCallback);
    expect(getPrivateTarget(cameraChaser)).toBeUndefined();
  });

  test("should handle multiple dispose calls safely", () => {
    const target = new Object3D();
    const originalCallback = target.onBeforeRender;

    const cameraChaser = new CameraChaser(target);

    // First dispose call
    cameraChaser.dispose();
    expect(target.onBeforeRender).toBe(originalCallback);
    expect(getPrivateTarget(cameraChaser)).toBeUndefined();

    // Second dispose call should not throw
    expect(() => {
      cameraChaser.dispose();
    }).not.toThrow();

    // Target should still have the original callback
    expect(target.onBeforeRender).toBe(originalCallback);
  });

  test("should handle dispose when target has no original onBeforeRender", () => {
    const target = new Object3D();
    // Three.js Object3D has a default onBeforeRender function, store it
    const defaultOnBeforeRender = target.onBeforeRender;

    const cameraChaser = new CameraChaser(target);
    expect(target.onBeforeRender).not.toBe(defaultOnBeforeRender);

    // Dispose should restore to the original default function
    cameraChaser.dispose();
    expect(target.onBeforeRender).toBe(defaultOnBeforeRender);
    expect(getPrivateTarget(cameraChaser)).toBeUndefined();
  });

  test("should handle onBeforeRender callback when target is disposed", () => {
    const camera = new PerspectiveCamera(45, 1, 1, 1000);
    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);

    // Enable camera chasing
    cameraChaser.isLookingCameraHorizontal = true;

    // Store the lookCamera function before disposing
    const lookCameraFunction = target.onBeforeRender;

    // Dispose the camera chaser (this sets target to undefined)
    cameraChaser.dispose();

    // Call the lookCamera function directly to test !this.target condition
    // This should handle the case where target is undefined and return early
    expect(() => {
      lookCameraFunction.call(
        cameraChaser,
        {} as unknown as WebGLRenderer, // renderer
        {} as unknown as Scene, // scene
        camera,
        {} as unknown as BufferGeometry, // geometry
        {} as unknown as Material, // material
        {} as unknown as Group, // group
      );
    }).not.toThrow();
  });
});
