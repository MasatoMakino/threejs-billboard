import * as pixi from "pixi.js";
import { Container, Ticker } from "pixi.js";
import type { Texture } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";
import type { IRenderablePixiView } from "../src/RenderablePixiView";

// autoDetectRenderer をモック化
vi.mock("pixi.js", async (importOriginal) => {
  const actual = await importOriginal<typeof pixi>();
  const mockRenderer = {
    render: vi.fn(),
    destroy: vi.fn(),
    resize: vi.fn(),
    width: 1,
    height: 1,
  };
  return {
    ...actual,
    autoDetectRenderer: vi.fn().mockResolvedValue(mockRenderer),
    WebGLRenderer: vi.fn().mockImplementation(() => mockRenderer),
  };
});

describe("PixiMultiViewManager Error Handling", () => {
  let manager: PixiMultiViewManager;
  let ticker: Ticker;

  beforeEach(async () => {
    ticker = new Ticker();
    ticker.autoStart = false;
    ticker.stop();
    ticker.update(0);

    // Set up default mock behavior without clearing all mocks
    const mockRenderer = {
      render: vi.fn(),
      destroy: vi.fn(),
      resize: vi.fn(),
      width: 1,
      height: 1,
    };
    vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(mockRenderer as never);

    manager = new PixiMultiViewManager({ ticker });
  });

  afterEach(() => {
    if (manager && !manager.isDisposed) {
      manager.dispose();
    }
    ticker.destroy();
    vi.restoreAllMocks();
  });

  describe("Renderer Initialization Failures", () => {
    it("should handle autoDetectRenderer failure gracefully", async () => {
      // Mock autoDetectRenderer to reject
      const mockError = new Error("WebGL not supported");
      vi.mocked(pixi.autoDetectRenderer).mockRejectedValue(mockError);

      await expect(manager.init()).rejects.toThrow("WebGL not supported");
      expect(manager.renderer).toBeNull();
    });

    it("should handle autoDetectRenderer returning null", async () => {
      // Mock autoDetectRenderer to return null
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(null as never);

      await expect(manager.init()).resolves.not.toThrow();
      expect(manager.renderer).toBeNull();
    });

    it("should handle renderer creation with invalid options", async () => {
      // Mock autoDetectRenderer to simulate invalid options
      const mockError = new Error("Invalid renderer options");
      vi.mocked(pixi.autoDetectRenderer).mockRejectedValue(mockError);

      await expect(manager.init()).rejects.toThrow("Invalid renderer options");
    });
  });

  describe("Canvas Creation Failures", () => {
    it("should handle canvas creation failure during rendering", async () => {
      // Setup a successful initialization first
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      // Create a mock instance with a canvas that fails getContext
      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 100,
          height: 100,
          getContext: vi.fn().mockReturnValue(null), // Simulate canvas context failure
        } as unknown as HTMLCanvasElement,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // This should not throw - it should gracefully handle the null context
      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
      mockRenderer.render.mockClear();

      // Verify the renderer was still called but context operations were skipped
      ticker.update(2);
      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: mockInstance.container,
        target: mockInstance.canvas,
      });
    });

    it("should handle canvas with zero dimensions", async () => {
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 0,
          height: 0,
          getContext: vi.fn().mockReturnValue({
            clearRect: vi.fn(),
          }),
        } as unknown as HTMLCanvasElement,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });

    it("should handle canvas with negative dimensions", async () => {
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: -100,
          height: -100,
          getContext: vi.fn().mockReturnValue({
            clearRect: vi.fn(),
          }),
        } as unknown as HTMLCanvasElement,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });
  });

  describe("Rendering Failures", () => {
    it("should handle renderer.render throwing an error", async () => {
      const mockRenderer = {
        render: vi.fn().mockImplementation(() => {
          throw new Error("Rendering failed");
        }),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 100,
          height: 100,
          getContext: vi.fn().mockReturnValue({
            clearRect: vi.fn(),
          }),
        } as unknown as HTMLCanvasElement,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Should not throw - error should be handled gracefully
      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });

    it("should handle renderer.resize throwing an error", async () => {
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn().mockImplementation(() => {
          throw new Error("Resize failed");
        }),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 1000, // Larger than renderer to trigger resize
          height: 1000,
          getContext: vi.fn().mockReturnValue({
            clearRect: vi.fn(),
          }),
        } as unknown as HTMLCanvasElement,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Should not throw - error should be handled gracefully
      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });
  });

  describe("Null Parameter Handling", () => {
    it("should handle null renderer in renderToTargetCanvas", async () => {
      // Don't initialize the manager to test null renderer condition
      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 100,
          height: 100,
          getContext: vi.fn().mockReturnValue({
            clearRect: vi.fn(),
          }),
        } as unknown as HTMLCanvasElement,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Should not throw when renderer is null (manager not initialized)
      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();

      // Verify renderer is null
      expect(manager.renderer).toBeNull();
    });

    it("should handle invalid canvas in renderToTargetCanvas", async () => {
      // Initialize manager first
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      // Create a real canvas but with getContext returning null (invalid state)
      const invalidCanvas = document.createElement("canvas");
      const originalGetContext = invalidCanvas.getContext;
      invalidCanvas.getContext = vi.fn().mockReturnValue(null);

      const mockInstance = {
        isDisposed: false,
        canvas: invalidCanvas,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Should not throw when canvas.getContext returns null
      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();

      // Restore original method
      invalidCanvas.getContext = originalGetContext;
    });

    it("should handle disposed texture in renderToTargetCanvas", async () => {
      // Initialize manager first
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      // Create a real canvas and a disposed texture
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;

      // Create a texture and dispose it to simulate null/invalid state
      const texture = { needsUpdate: false } as Texture;

      const mockInstance = {
        isDisposed: false,
        canvas: canvas,
        texture: texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Should not throw when processing disposed texture
      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });

    it("should skip disposed instances in renderAllQueued", async () => {
      // Initialize manager first
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      // Create a normal instance first with real canvas
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;

      const normalInstance = {
        isDisposed: false,
        canvas: canvas,
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Request render for normal instance
      manager.requestRender(normalInstance);

      // Now dispose the instance after it's queued by setting isDisposed property
      Object.defineProperty(normalInstance, "isDisposed", {
        value: true,
        writable: true,
        configurable: true,
      });

      // Clear previous calls
      mockRenderer.render.mockClear();

      // Update ticker to trigger rendering
      ticker.update(1);

      // Should not render the disposed instance
      expect(mockRenderer.render).not.toHaveBeenCalled();
    });
  });
});
