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

describe("PixiMultiViewManager Edge Cases", () => {
  let manager: PixiMultiViewManager;
  let ticker: Ticker;
  let mockRenderer: {
    render: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    resize: ReturnType<typeof vi.fn>;
    width: number;
    height: number;
  };

  beforeEach(async () => {
    ticker = new Ticker();
    ticker.autoStart = false;

    // Get the autoDetectRenderer mock and set up fresh mock renderer
    const autoDetectRendererSpy = vi.mocked(pixi.autoDetectRenderer);
    mockRenderer = {
      render: vi.fn(),
      destroy: vi.fn(),
      resize: vi.fn().mockImplementation((w: number, h: number) => {
        mockRenderer.width = w;
        mockRenderer.height = h;
      }),
      width: 1,
      height: 1,
    };
    autoDetectRendererSpy.mockResolvedValue(mockRenderer as never);

    manager = new PixiMultiViewManager({ ticker });
    await manager.init();
    ticker.stop();
    ticker.update(0);
  });

  afterEach(() => {
    if (manager && !manager.isDisposed) {
      manager.dispose();
    }
    ticker.destroy();
    vi.restoreAllMocks();
  });

  describe("Canvas Dimension Edge Cases", () => {
    it("should handle extremely large canvas dimensions", async () => {
      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 32768, // Common GPU texture size limit
          height: 32768,
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

      // Verify renderer was resized to accommodate large canvas
      expect(mockRenderer.resize).toHaveBeenCalledWith(32768, 32768);
    });

    it("should handle canvas with one dimension zero", async () => {
      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 100,
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

      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: mockInstance.container,
        target: mockInstance.canvas,
      });
    });

    it("should handle canvas with both dimensions zero", async () => {
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

      // Renderer should not be resized when canvas dimensions are zero
      expect(mockRenderer.resize).not.toHaveBeenCalled();
    });

    it("should handle canvas with float dimensions", async () => {
      const mockInstance = {
        isDisposed: false,
        canvas: {
          width: 100.5,
          height: 200.7,
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

      // Math.max should handle float dimensions correctly
      expect(mockRenderer.resize).toHaveBeenCalledWith(100.5, 200.7);
    });
  });

  describe("Rapid Operations Edge Cases", () => {
    it("should handle rapid disposal and recreation", async () => {
      const instances: IRenderablePixiView[] = [];

      // Create many instances rapidly
      for (let i = 0; i < 100; i++) {
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
        instances.push(mockInstance);
        manager.requestRender(mockInstance);
      }

      // Dispose half of them before rendering
      for (let i = 0; i < 50; i++) {
        instances[i].isDisposed = true;
      }

      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // Should only render the non-disposed instances
      expect(mockRenderer.render).toHaveBeenCalledTimes(50);
    });

    it("should handle rapid multiple render requests for same instance", async () => {
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

      // Request render multiple times for same instance
      for (let i = 0; i < 100; i++) {
        manager.requestRender(mockInstance);
      }

      ticker.update(1);

      // Should only render once due to Set deduplication
      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });

    it("should handle manager disposal during active render queue", async () => {
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

      manager.requestRender(mockInstance);

      // Dispose manager before ticker update
      manager.dispose();

      // Ticker update should not throw
      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // Render should not have been called
      expect(mockRenderer.render).not.toHaveBeenCalled();
    });
  });

  describe("Renderer Size Edge Cases", () => {
    it("should handle renderer with zero initial size", async () => {
      // Reset renderer to have zero size
      mockRenderer.width = 0;
      mockRenderer.height = 0;

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

      expect(() => {
        manager.requestRender(mockInstance);
        ticker.update(1);
      }).not.toThrow();

      expect(mockRenderer.resize).toHaveBeenCalledWith(100, 100);
    });

    it("should handle renderer size fluctuations", async () => {
      const instances: IRenderablePixiView[] = [];

      // Create instances with varying sizes
      const sizes = [
        [10, 10],
        [1000, 1000],
        [50, 50],
        [2000, 2000],
        [1, 1],
      ];

      for (const [width, height] of sizes) {
        const mockInstance = {
          isDisposed: false,
          canvas: {
            width,
            height,
            getContext: vi.fn().mockReturnValue({
              clearRect: vi.fn(),
            }),
          } as unknown as HTMLCanvasElement,
          texture: { needsUpdate: false } as Texture,
          container: new Container(),
        } as IRenderablePixiView;
        instances.push(mockInstance);
        manager.requestRender(mockInstance);
      }

      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // Should have resized to accommodate the largest dimensions
      expect(mockRenderer.resize).toHaveBeenCalledWith(2000, 2000);
    });
  });

  describe("Concurrent Access Edge Cases", () => {
    it("should handle concurrent requestRender calls", async () => {
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

      // Simulate concurrent calls
      const promises: Promise<void>[] = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          Promise.resolve().then(() => {
            manager.requestRender(mockInstance);
          }),
        );
      }

      await Promise.all(promises);

      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // Should only render once due to Set deduplication
      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });

    it("should handle instance disposal during queue processing", async () => {
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

      manager.requestRender(mockInstance);

      // Mock the render method to dispose the instance during processing
      mockRenderer.render.mockImplementation(() => {
        mockInstance.isDisposed = true;
      });

      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });
  });

  describe("Boundary Value Testing", () => {
    it("should handle negative dimensions", async () => {
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

      // Negative dimensions are smaller than current renderer size (1x1), so resize should NOT be called
      expect(mockRenderer.resize).not.toHaveBeenCalled();
    });
  });
});
