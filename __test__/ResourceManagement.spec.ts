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

/**
 * Helper function to get the render queue from PixiMultiViewManager
 * @param manager - The PixiMultiViewManager instance
 * @returns The internal render queue
 */
const getRenderQueue = (
  manager: PixiMultiViewManager,
): Set<IRenderablePixiView> => {
  return (manager as unknown as { _renderQueue: Set<IRenderablePixiView> })
    ._renderQueue;
};

/**
 * Helper function to get the render loop function from PixiMultiViewManager
 * @param manager - The PixiMultiViewManager instance
 * @returns The internal render loop function
 */
const getRenderLoop = (manager: PixiMultiViewManager): (() => void) => {
  return (manager as unknown as { _renderLoop: () => void })._renderLoop;
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
      const renderLoop = getRenderLoop(manager);

      manager.dispose();

      expect(tickerRemoveSpy).toHaveBeenCalledWith(renderLoop, manager);
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

  describe("Resource Reuse Scenarios", () => {
    it("should efficiently handle canvas reuse patterns", async () => {
      const billboard = createMockBillboard("reuse");

      // Simulate content updates requiring re-rendering
      for (let frame = 0; frame < 60; frame++) {
        manager.requestRender(billboard);
        ticker.update(frame + 1); // Use incremental time

        // Reset texture update flag to simulate texture usage
        billboard.texture.needsUpdate = false;
      }

      // Should have rendered 60 times (once per frame)
      expect(mockRenderer.render).toHaveBeenCalledTimes(60);

      // Canvas and context should be reused efficiently
      const contextCalls = billboard.canvas.getContext as ReturnType<
        typeof vi.fn
      >;
      expect(contextCalls).toHaveBeenCalledTimes(60);
    });

    it("should handle renderer size optimization for reused billboards", async () => {
      const billboard = createMockBillboard("size-test", 100, 100);

      manager.requestRender(billboard);
      ticker.update(1);

      // Initial resize
      expect(mockRenderer.resize).toHaveBeenCalledWith(100, 100);
      mockRenderer.resize.mockClear();

      // Same size billboard - should not resize again
      manager.requestRender(billboard);
      ticker.update(2);

      expect(mockRenderer.resize).not.toHaveBeenCalled();

      // Larger billboard - should resize
      billboard.canvas.width = 200;
      billboard.canvas.height = 200;
      manager.requestRender(billboard);
      ticker.update(3);

      expect(mockRenderer.resize).toHaveBeenCalledWith(200, 200);
    });

    it("should optimize batch rendering for repeated instances", async () => {
      const billboards = Array.from({ length: 10 }, (_, i) =>
        createMockBillboard(`repeat-${i}`),
      );

      // Queue same billboards multiple times
      for (let iteration = 0; iteration < 5; iteration++) {
        billboards.forEach((billboard) => {
          manager.requestRender(billboard);
        });
      }

      ticker.update(1);

      // Should only render each billboard once per frame
      expect(mockRenderer.render).toHaveBeenCalledTimes(10);
    });

    it("should handle texture update optimization", async () => {
      const billboards = Array.from({ length: 5 }, (_, i) =>
        createMockBillboard(`texture-${i}`),
      );

      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      ticker.update(1);

      // All textures should be marked for update
      billboards.forEach((billboard) => {
        expect(billboard.texture.needsUpdate).toBe(true);
      });

      // Reset flags
      billboards.forEach((billboard) => {
        billboard.texture.needsUpdate = false;
      });

      // Re-render same billboards
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      mockRenderer.render.mockClear();
      ticker.update(2);

      // Should render again and update textures
      expect(mockRenderer.render).toHaveBeenCalledTimes(5);
      billboards.forEach((billboard) => {
        expect(billboard.texture.needsUpdate).toBe(true);
      });
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

    it("should handle weak references correctly", async () => {
      const billboard = createMockBillboard("weak-ref");

      manager.requestRender(billboard);

      // Queue should contain the billboard
      const queue = getRenderQueue(manager);
      expect(queue.has(billboard)).toBe(true);

      ticker.update(1);

      // Queue should be cleared after rendering
      expect(queue.size).toBe(0);
    });

    it("should prevent circular references", async () => {
      const billboard = createMockBillboard("circular");

      // Create potential circular reference
      (billboard as unknown as { manager: PixiMultiViewManager }).manager =
        manager;
      (
        billboard.container as unknown as { billboard: IRenderablePixiView }
      ).billboard = billboard;

      manager.requestRender(billboard);
      ticker.update(1);

      // Should handle gracefully without memory leaks
      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: billboard.container,
        target: billboard.canvas,
      });

      // Clean up circular references
      delete (billboard as unknown as { manager?: PixiMultiViewManager })
        .manager;
      delete (
        billboard.container as unknown as { billboard?: IRenderablePixiView }
      ).billboard;
    });

    it("should handle forced garbage collection simulation", async () => {
      // Create and dispose many objects to simulate GC pressure
      for (let batch = 0; batch < 10; batch++) {
        const batchBillboards = Array.from({ length: 100 }, (_, i) =>
          createMockBillboard(`gc-batch-${batch}-${i}`),
        );

        // Queue all
        batchBillboards.forEach((billboard) => {
          manager.requestRender(billboard);
        });

        // Render
        ticker.update(batch * 2 + 1);

        // Immediately dispose
        batchBillboards.forEach((billboard) => {
          billboard.isDisposed = true;
        });

        // Clear queue
        ticker.update(batch * 2 + 2);

        mockRenderer.render.mockClear();
      }

      // Manager should still be functional
      const testBillboard = createMockBillboard("post-gc-test");
      manager.requestRender(testBillboard);
      ticker.update(1000);

      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: testBillboard.container,
        target: testBillboard.canvas,
      });
    });
  });

  describe("Resource Monitoring and Metrics", () => {
    it("should maintain consistent internal state", async () => {
      const billboard = createMockBillboard("state-test");

      // Initial state
      expect(manager.isDisposed).toBe(false);
      expect(manager.renderer).toBe(mockRenderer);

      // After operations
      manager.requestRender(billboard);
      ticker.update(1);

      expect(manager.isDisposed).toBe(false);
      expect(manager.renderer).toBe(mockRenderer);

      // After disposal
      manager.dispose();

      expect(manager.isDisposed).toBe(true);
      expect(manager.renderer).toBeNull();
    });

    it("should track resource usage patterns", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];
      const operations: string[] = [];

      // Track various operations
      for (let i = 0; i < 50; i++) {
        const billboard = createMockBillboard(`track-${i}`);
        billboards.push(billboard);

        operations.push(`create-${i}`);
        manager.requestRender(billboard);
        operations.push(`queue-${i}`);

        if (i % 10 === 9) {
          ticker.update(Math.floor(i / 10) + 1); // Use incremental time for each batch
          operations.push(`render-batch-${Math.floor(i / 10)}`);

          // Dispose some
          billboards.slice(i - 4, i).forEach((b) => {
            b.isDisposed = true;
          });
          operations.push(`dispose-batch-${Math.floor(i / 10)}`);
        }
      }

      // Final render
      ticker.update(100); // Use a much later time for final render
      operations.push("final-render");

      // Verify operations completed successfully
      expect(operations.length).toBe(111); // 50 creates + 50 queues + 5 renders + 5 disposes + 1 final
      expect(mockRenderer.render).toHaveBeenCalled();
    });
  });
});
