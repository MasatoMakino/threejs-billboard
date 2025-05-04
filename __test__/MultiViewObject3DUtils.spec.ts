import { describe, expect, it, vi } from "vitest";
import { MultiViewObject3DUtils } from "../src/MultiViewObject3DUtils.js";
import type { MeshBasicMaterial } from "three";
import type { Container } from "pixi.js";

describe("MultiViewObject3DUtils", () => {
  it("disposeMaterials should dispose single material and its map", () => {
    const mockMap = { dispose: vi.fn() };
    const mockMaterial = {
      dispose: vi.fn(),
      map: mockMap,
    } as unknown as MeshBasicMaterial;

    MultiViewObject3DUtils.disposeMaterials(mockMaterial);

    expect(mockMap.dispose).toHaveBeenCalledOnce();
    expect(mockMaterial.dispose).toHaveBeenCalledOnce();
  });

  it("disposeMaterials should dispose array of materials and their maps", () => {
    const mockMap1 = { dispose: vi.fn() };
    const mockMaterial1 = {
      dispose: vi.fn(),
      map: mockMap1,
    } as unknown as MeshBasicMaterial;
    const mockMap2 = { dispose: vi.fn() };
    const mockMaterial2 = {
      dispose: vi.fn(),
      map: mockMap2,
    } as unknown as MeshBasicMaterial;
    const materials = [mockMaterial1, mockMaterial2];

    MultiViewObject3DUtils.disposeMaterials(materials);

    expect(mockMap1.dispose).toHaveBeenCalledOnce();
    expect(mockMaterial1.dispose).toHaveBeenCalledOnce();
    expect(mockMap2.dispose).toHaveBeenCalledOnce();
    expect(mockMaterial2.dispose).toHaveBeenCalledOnce();
  });

  it("disposeMaterials should handle materials without maps", () => {
    const mockMaterial = { dispose: vi.fn() } as unknown as MeshBasicMaterial;

    MultiViewObject3DUtils.disposeMaterials(mockMaterial);

    expect(mockMaterial.dispose).toHaveBeenCalledOnce();
  });

  it("disposeStageContainer should remove from parent, remove children and destroy container", () => {
    const mockContainer = {
      removeFromParent: vi.fn(),
      removeChildren: vi.fn(),
      destroy: vi.fn(),
    } as unknown as Container;

    MultiViewObject3DUtils.disposeStageContainer(mockContainer);

    expect(mockContainer.removeFromParent).toHaveBeenCalledOnce();
    expect(mockContainer.removeChildren).toHaveBeenCalledOnce();
    expect(mockContainer.destroy).toHaveBeenCalledWith({ children: true });
  });

  it("disposeStageContainer should handle null container", () => {
    const mockContainer = null as unknown as Container;
    expect(() =>
      MultiViewObject3DUtils.disposeStageContainer(mockContainer),
    ).not.toThrow();
  });

  it("disposeCanvas should remove canvas from parent node", () => {
    const mockCanvas = document.createElement("canvas");
    document.body.appendChild(mockCanvas);

    // Spy on the removeChild method of the actual parentNode
    const parent = mockCanvas.parentNode;
    if (!parent) throw new Error("Canvas parent node not found");
    const removeChildSpy = vi.spyOn(parent, "removeChild");

    MultiViewObject3DUtils.disposeCanvas(mockCanvas);

    // Expect removeChild to have been called with the canvas
    expect(removeChildSpy).toHaveBeenCalledWith(mockCanvas);

    // Clean up the spy
    removeChildSpy.mockRestore();
  });

  it("disposeCanvas should handle canvas without parent node", () => {
    const mockCanvas = document.createElement("canvas");
    expect(() =>
      MultiViewObject3DUtils.disposeCanvas(mockCanvas),
    ).not.toThrow();
  });

  it("disposeCanvas should handle null canvas", () => {
    const mockCanvas = null as unknown as HTMLCanvasElement;
    expect(() =>
      MultiViewObject3DUtils.disposeCanvas(mockCanvas),
    ).not.toThrow();
  });
});
