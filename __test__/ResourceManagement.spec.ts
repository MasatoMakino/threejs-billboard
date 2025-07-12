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

/**
 * Helper function to get the render queue size from PixiMultiViewManager
 * @param manager - The PixiMultiViewManager instance
 * @returns The size of the internal render queue
 */
const getRenderQueueSize = (manager: PixiMultiViewManager): number => {
  return (manager as unknown as { _renderQueue: Set<unknown> })._renderQueue
    .size;
};

describe("Resource Management Tests", () => {
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

  const createMockBillboard = (id: string, width = 100, height = 100) => {
    return {
      id,
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
    } as IRenderablePixiView & { id: string };
  };

  describe("Memory Usage Patterns", () => {
    it("should handle memory efficient batch processing", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];
      const batchSize = 100;

      // Create large batch
      for (let i = 0; i < batchSize; i++) {
        const billboard = createMockBillboard(`batch-${i}`);
        billboards.push(billboard);
        manager.requestRender(billboard);
      }

      // Process in single batch
      ticker.update(1);

      // Verify all rendered in one go
      expect(mockRenderer.render).toHaveBeenCalledTimes(batchSize);

      // Check queue is cleared after processing
      expect(getRenderQueueSize(manager)).toBe(0);
    });

    it("should handle memory pressure with large canvas textures", async () => {
      const largeBillboards: (IRenderablePixiView & { id: string })[] = [];
      const sizes = [1024, 2048, 4096, 8192]; // Progressively larger textures

      for (const size of sizes) {
        const billboard = createMockBillboard(`large-${size}`, size, size);
        largeBillboards.push(billboard);
        manager.requestRender(billboard);
      }

      ticker.update(1);

      // Should handle large textures without errors
      expect(mockRenderer.render).toHaveBeenCalledTimes(4);

      // Renderer should be resized to accommodate largest texture
      expect(mockRenderer.resize).toHaveBeenCalledWith(8192, 8192);
    });

    it("should efficiently reuse internal objects", async () => {
      const billboard = createMockBillboard("reuse-test");

      // Multiple render requests for same instance
      for (let i = 0; i < 100; i++) {
        manager.requestRender(billboard);
      }

      ticker.update(1);

      // Should only render once due to Set deduplication
      expect(mockRenderer.render).toHaveBeenCalledTimes(1);

      // Queue should be efficiently cleared
      expect(getRenderQueueSize(manager)).toBe(0);
    });

    it("should handle memory fragmentation scenarios", async () => {
      // Simulate memory fragmentation with varied allocation patterns
      const allBillboards: (IRenderablePixiView & { id: string })[] = [];

      // Create initial set
      for (let i = 0; i < 50; i++) {
        const billboard = createMockBillboard(`initial-${i}`);
        allBillboards.push(billboard);
        manager.requestRender(billboard);
      }

      ticker.update(1);
      mockRenderer.render.mockClear();

      // Dispose every other billboard (fragmentation)
      for (let i = 0; i < allBillboards.length; i += 2) {
        allBillboards[i].isDisposed = true;
      }

      // Add new billboards to fill gaps
      for (let i = 0; i < 25; i++) {
        const billboard = createMockBillboard(`new-${i}`);
        allBillboards.push(billboard);
        manager.requestRender(billboard);
      }

      ticker.update(2); // Use a later time to trigger the update

      // Should render all active billboards that were queued (25 new ones)
      expect(mockRenderer.render).toHaveBeenCalledTimes(25);
    });
  });

  describe("Cleanup Verification", () => {
    it("should properly clean up render queue on disposal", async () => {
      const billboards = Array.from({ length: 20 }, (_, i) =>
        createMockBillboard(`cleanup-${i}`),
      );

      // Queue all billboards
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      // Verify queue has items
      expect(getRenderQueueSize(manager)).toBe(20);

      // Dispose manager
      manager.dispose();

      // Verify queue is cleared
      expect(getRenderQueueSize(manager)).toBe(0);
    });

    it("should clean up ticker listeners on disposal", async () => {
      const tickerRemoveSpy = vi.spyOn(ticker, "remove");

      manager.dispose();

      expect(tickerRemoveSpy).toHaveBeenCalled();
    });

    it("should clean up renderer on disposal", async () => {
      manager.dispose();

      expect(mockRenderer.destroy).toHaveBeenCalledOnce();
    });

    it("should handle disposal with pending renders gracefully", async () => {
      const billboard = createMockBillboard("pending");
      manager.requestRender(billboard);

      // Dispose before ticker update
      manager.dispose();

      // Ticker update should not cause errors
      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // No rendering should occur
      expect(mockRenderer.render).not.toHaveBeenCalled();
    });

    it("should prevent memory leaks with repeated init/dispose cycles", async () => {
      // Dispose current manager
      manager.dispose();
      mockRenderer.destroy.mockClear();

      // Simulate multiple init/dispose cycles
      for (let cycle = 0; cycle < 10; cycle++) {
        const testManager = new PixiMultiViewManager({ ticker });
        await testManager.init();

        const billboard = createMockBillboard(`cycle-${cycle}`);
        testManager.requestRender(billboard);
        ticker.update(cycle + 10); // Use incremental time

        testManager.dispose();
      }

      // Should complete without errors
      expect(mockRenderer.destroy).toHaveBeenCalledTimes(10);
    });
  });

  describe("Resource Limits and Constraints", () => {
    it("should handle maximum canvas size constraints", async () => {
      // Test with various large sizes that might hit GPU limits
      const largeSizes = [
        { width: 16384, height: 16384 }, // Common max texture size
        { width: 32768, height: 32768 }, // Extreme size
        { width: 65536, height: 1 }, // Very wide
        { width: 1, height: 65536 }, // Very tall
      ];

      largeSizes.forEach((size, index) => {
        const billboard = createMockBillboard(
          `large-${index}`,
          size.width,
          size.height,
        );

        expect(() => {
          manager.requestRender(billboard);
          ticker.update(index + 100); // Use incremental time for each iteration
        }).not.toThrow();
      });

      expect(mockRenderer.render).toHaveBeenCalledTimes(4);
    });

    it("should handle resource exhaustion gracefully", async () => {
      // Simulate resource exhaustion by making resize throw
      mockRenderer.resize.mockImplementation(() => {
        throw new Error("GPU memory exhausted");
      });

      const billboard = createMockBillboard("exhaustion-test", 1000, 1000);

      expect(() => {
        manager.requestRender(billboard);
        ticker.update(1);
      }).toThrow("GPU memory exhausted");

      // Should attempt resize before throwing
      expect(mockRenderer.resize).toHaveBeenCalled();
    });

    it("should handle concurrent resource access", async () => {
      const billboard = createMockBillboard("concurrent");

      // Simulate concurrent access to renderer
      const renderPromises: Promise<void>[] = [];

      for (let i = 0; i < 10; i++) {
        renderPromises.push(
          new Promise((resolve) => {
            setTimeout(() => {
              manager.requestRender(billboard);
              resolve();
            }, Math.random() * 10);
          }),
        );
      }

      await Promise.all(renderPromises);
      ticker.update(1);

      // Should handle concurrent requests gracefully
      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });
  });

  describe("Garbage Collection and Memory Leaks", () => {
    it("should not retain references to disposed billboards", async () => {
      const billboards = Array.from({ length: 20 }, (_, i) =>
        createMockBillboard(`gc-test-${i}`),
      );

      // Queue and render
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });
      ticker.update(1);

      // Dispose billboards
      billboards.forEach((billboard) => {
        billboard.isDisposed = true;
      });

      // Another render should clear disposed items from queue
      ticker.update(1);

      // Queue should be empty
      expect(getRenderQueueSize(manager)).toBe(0);
    });
  });
});
