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

  describe("Ticker Failures", () => {
    it("should handle ticker.add throwing an error", async () => {
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

      // Mock ticker.add to throw
      const mockTicker = {
        add: vi.fn().mockImplementation(() => {
          throw new Error("Failed to add ticker callback");
        }),
        start: vi.fn(),
        stop: vi.fn(),
        remove: vi.fn(),
        destroy: vi.fn(),
        autoStart: false,
      } as unknown as Ticker;

      const managerWithFailingTicker = new PixiMultiViewManager({
        ticker: mockTicker,
      });

      await expect(managerWithFailingTicker.init()).rejects.toThrow(
        "Failed to add ticker callback",
      );
    });

    it("should handle ticker.start throwing an error", async () => {
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

      // Mock ticker.start to throw
      const mockTicker = {
        add: vi.fn(),
        start: vi.fn().mockImplementation(() => {
          throw new Error("Failed to start ticker");
        }),
        stop: vi.fn(),
        remove: vi.fn(),
        destroy: vi.fn(),
        autoStart: false,
      } as unknown as Ticker;

      const managerWithFailingTicker = new PixiMultiViewManager({
        ticker: mockTicker,
      });

      await expect(managerWithFailingTicker.init()).rejects.toThrow(
        "Failed to start ticker",
      );
    });
  });

  describe("Memory and Resource Failures", () => {
    it("should handle out-of-memory scenarios during rendering", async () => {
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn(),
        resize: vi.fn().mockImplementation(() => {
          throw new Error("Out of memory");
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
          width: 10000, // Very large canvas to trigger resize
          height: 10000,
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

    it("should handle renderer destruction failure", async () => {
      const mockRenderer = {
        render: vi.fn(),
        destroy: vi.fn().mockImplementation(() => {
          throw new Error("Failed to destroy renderer");
        }),
        resize: vi.fn(),
        width: 1,
        height: 1,
      };
      vi.mocked(pixi.autoDetectRenderer).mockResolvedValue(
        mockRenderer as never,
      );
      await manager.init();

      // Currently the implementation throws if renderer.destroy fails
      // This test documents the current behavior
      expect(() => {
        manager.dispose();
      }).toThrow("Failed to destroy renderer");
    });
  });

  describe("Null and Undefined Handling", () => {
    it("should handle null renderer gracefully", async () => {
      // Don't initialize the manager
      const mockInstance = {
        isDisposed: false,
        canvas: document.createElement("canvas"),
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });

    it("should handle null texture gracefully", async () => {
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
        canvas: document.createElement("canvas"),
        texture: null as unknown as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });

    it("should handle null container gracefully", async () => {
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
        canvas: document.createElement("canvas"),
        texture: { needsUpdate: false } as Texture,
        container: null as unknown as Container,
      } as IRenderablePixiView;

      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle concurrent init calls", async () => {
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

      // Call init multiple times concurrently
      const initPromises = [manager.init(), manager.init(), manager.init()];

      await expect(Promise.all(initPromises)).resolves.not.toThrow();
      expect(manager.renderer).toBe(mockRenderer);
    });

    it("should handle concurrent dispose calls", async () => {
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

      // Call dispose multiple times concurrently
      expect(() => {
        manager.dispose();
        manager.dispose();
        manager.dispose();
      }).not.toThrow();
    });

    it("should handle requestRender calls during disposal", async () => {
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
        canvas: document.createElement("canvas"),
        texture: { needsUpdate: false } as Texture,
        container: new Container(),
      } as IRenderablePixiView;

      // Add instance to queue, then dispose
      manager.requestRender(mockInstance);
      manager.dispose();

      // Should not throw when ticker tries to process queue
      expect(() => {
        ticker.update(1);
      }).not.toThrow();
    });
  });
});
