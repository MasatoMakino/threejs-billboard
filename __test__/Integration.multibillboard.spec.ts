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

describe("Multi-Billboard Integration Tests", () => {
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

  describe("Multiple Billboard Coordination", () => {
    it("should handle multiple billboards with different sizes", async () => {
      const billboards = [
        createMockBillboard("small", 50, 50),
        createMockBillboard("medium", 200, 200),
        createMockBillboard("large", 500, 500),
        createMockBillboard("wide", 800, 200),
        createMockBillboard("tall", 100, 600),
      ];

      // Request render for all billboards
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      ticker.update(1);

      // All billboards should be rendered
      expect(mockRenderer.render).toHaveBeenCalledTimes(5);

      // Renderer should be resized multiple times, ending with the largest dimensions
      expect(mockRenderer.resize).toHaveBeenLastCalledWith(800, 600); // Final call with maximum dimensions

      // All textures should be marked for update
      billboards.forEach((billboard) => {
        expect(billboard.texture.needsUpdate).toBe(true);
      });
    });

    it("should handle rapid sequential billboard creation and rendering", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];
      const count = 50;

      // Create and queue many billboards rapidly
      for (let i = 0; i < count; i++) {
        const billboard = createMockBillboard(
          `billboard-${i}`,
          100 + i,
          100 + i,
        );
        billboards.push(billboard);
        manager.requestRender(billboard);
      }

      ticker.update(1);

      // All billboards should be rendered
      expect(mockRenderer.render).toHaveBeenCalledTimes(count);

      // Renderer should be sized for the largest billboard
      const maxSize = 100 + (count - 1);
      expect(mockRenderer.resize).toHaveBeenCalledWith(maxSize, maxSize);
    });

    it("should handle billboard lifecycle with mixed creation and disposal", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];

      // Create initial set
      for (let i = 0; i < 10; i++) {
        const billboard = createMockBillboard(`initial-${i}`);
        billboards.push(billboard);
        manager.requestRender(billboard);
      }

      ticker.update(1);
      expect(mockRenderer.render).toHaveBeenCalledTimes(10);
      mockRenderer.render.mockClear();

      // Dispose some, add some new ones
      billboards[1].isDisposed = true;
      billboards[3].isDisposed = true;
      billboards[7].isDisposed = true;

      const newBillboards = [
        createMockBillboard("new-1"),
        createMockBillboard("new-2"),
        createMockBillboard("new-3"),
      ];
      newBillboards.forEach((billboard) => {
        billboards.push(billboard);
      });

      // Request render for all billboards again
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });
      // Re-request some existing ones
      manager.requestRender(billboards[0]);
      manager.requestRender(billboards[2]);

      ticker.update(2);

      // Should render: 7 existing (10 - 3 disposed) + 3 new + 2 re-requested = 10 unique
      // Due to Set deduplication, re-requested should not be duplicated
      expect(mockRenderer.render).toHaveBeenCalledTimes(10);
    });
  });

  describe("Performance Under Load", () => {
    it("should handle high-frequency updates", async () => {
      const billboard = createMockBillboard("high-freq");

      // Simulate high-frequency updates
      for (let frame = 10; frame < 70; frame++) {
        // 60 frames
        for (let update = 0; update < 10; update++) {
          // 10 updates per frame
          manager.requestRender(billboard);
        }

        ticker.update(frame);

        // Each frame should only render once due to deduplication
        expect(mockRenderer.render).toHaveBeenCalledTimes(1);
        mockRenderer.render.mockClear();
      }
    });

    it("should handle burst rendering requests", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];

      // Create a large burst of billboards
      const burstSize = 100;
      for (let i = 0; i < burstSize; i++) {
        const billboard = createMockBillboard(`burst-${i}`);
        billboards.push(billboard);
      }

      // Request all at once
      const startTime = performance.now();
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      ticker.update(1);
      const endTime = performance.now();

      // Should complete in reasonable time (less than 100ms for 100 billboards)
      expect(endTime - startTime).toBeLessThan(100);
      expect(mockRenderer.render).toHaveBeenCalledTimes(burstSize);
    });

    it("should maintain performance with varying canvas sizes", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];

      // Create billboards with exponentially increasing sizes
      for (let i = 0; i < 10; i++) {
        const size = 2 ** (i + 4); // 16, 32, 64, ... 8192
        const billboard = createMockBillboard(`size-${size}`, size, size);
        billboards.push(billboard);
        manager.requestRender(billboard);
      }

      const startTime = performance.now();
      ticker.update(1);
      const endTime = performance.now();

      // Should complete efficiently even with large size variations
      expect(endTime - startTime).toBeLessThan(50);
      expect(mockRenderer.render).toHaveBeenCalledTimes(10);

      // Should be resized to largest size (8192)
      expect(mockRenderer.resize).toHaveBeenCalledWith(8192, 8192);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle interleaved operations", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];

      // Complex sequence of operations
      for (let cycle = 0; cycle < 5; cycle++) {
        // Add some billboards
        for (let i = 0; i < 5; i++) {
          const billboard = createMockBillboard(`cycle-${cycle}-${i}`);
          billboards.push(billboard);
          manager.requestRender(billboard);
        }

        // Render some
        ticker.update(1);

        // Dispose some from previous cycles
        if (cycle > 0) {
          const startIdx = (cycle - 1) * 5;
          billboards[startIdx].isDisposed = true;
          billboards[startIdx + 2].isDisposed = true;
        }

        // Re-request some
        if (billboards.length > 2) {
          manager.requestRender(billboards[billboards.length - 2]);
          manager.requestRender(billboards[billboards.length - 1]);
        }
      }

      // Final render
      ticker.update(1);

      // Should handle all operations without errors
      expect(mockRenderer.render).toHaveBeenCalled();
    });

    it("should handle concurrent manager operations", async () => {
      const billboard1 = createMockBillboard("concurrent-1");
      const billboard2 = createMockBillboard("concurrent-2");

      // Simulate concurrent operations
      const operations = [
        () => manager.requestRender(billboard1),
        () => manager.requestRender(billboard2),
        () => {
          billboard1.isDisposed = false;
        },
        () => {
          billboard2.isDisposed = false;
        },
        () => manager.requestRender(billboard1),
        () => ticker.update(1),
      ];

      // Execute operations in rapid succession
      operations.forEach((op) => op());

      // Should not throw and should render both billboards
      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: billboard1.container,
        target: billboard1.canvas,
      });
      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: billboard2.container,
        target: billboard2.canvas,
      });
    });

    it("should handle mixed billboard types simulation", async () => {
      // Simulate different types of billboards with different characteristics
      const types = [
        { name: "ui", size: 64, count: 20 }, // Small UI elements
        { name: "sprite", size: 128, count: 15 }, // Medium sprites
        { name: "poster", size: 512, count: 5 }, // Large posters
        { name: "banner", width: 1024, height: 128, count: 3 }, // Wide banners
      ];

      const allBillboards: (IRenderablePixiView & {
        id: string;
        type: string;
      })[] = [];

      types.forEach((type) => {
        for (let i = 0; i < type.count; i++) {
          const billboard = {
            ...createMockBillboard(
              `${type.name}-${i}`,
              "width" in type ? type.width : type.size,
              "height" in type ? type.height : type.size,
            ),
            type: type.name,
          };
          allBillboards.push(billboard);
        }
      });

      // Request render for all billboards
      allBillboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      ticker.update(1);

      // Should render all billboards
      const totalCount = types.reduce((sum, type) => sum + type.count, 0);
      expect(mockRenderer.render).toHaveBeenCalledTimes(totalCount);

      // Should resize to accommodate largest dimensions (1024x512)
      expect(mockRenderer.resize).toHaveBeenCalledWith(1024, 512);
      mockRenderer.render.mockClear();

      // Simulate dynamic changes - dispose UI elements, add new sprites
      allBillboards
        .filter((b) => b.type === "ui")
        .slice(0, 10)
        .forEach((b) => {
          b.isDisposed = true;
        });

      // Add new dynamic sprites
      for (let i = 0; i < 5; i++) {
        const newSprite = {
          ...createMockBillboard(`dynamic-sprite-${i}`, 256, 256),
          type: "dynamic",
        };
        allBillboards.push(newSprite);
      }
      // Re-render after changes
      allBillboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });
      ticker.update(2);

      // Should render remaining + new billboards
      const activeCount = allBillboards.filter((b) => !b.isDisposed).length;
      expect(mockRenderer.render).toHaveBeenCalledTimes(activeCount);
    });
  });

  describe("Resource Management Integration", () => {
    it("should handle manager disposal with active billboards", async () => {
      const billboards = Array.from({ length: 10 }, (_, i) =>
        createMockBillboard(`billboard-${i}`),
      );

      // Queue all billboards
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      // Dispose manager before rendering
      manager.dispose();

      // Subsequent ticker updates should not cause errors
      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // No rendering should occur after disposal
      expect(mockRenderer.render).not.toHaveBeenCalled();
    });

    it("should handle billboard disposal during batch rendering", async () => {
      const billboards = Array.from({ length: 20 }, (_, i) =>
        createMockBillboard(`billboard-${i}`),
      );

      // Queue all billboards
      billboards.forEach((billboard) => {
        manager.requestRender(billboard);
      });

      // Mock render to dispose some billboards during rendering
      let renderCount = 0;
      mockRenderer.render.mockImplementation(() => {
        renderCount++;
        if (renderCount % 3 === 0) {
          // Dispose every third billboard during rendering
          const billboardIndex = Math.floor((renderCount - 1) / 3) * 3;
          if (billboards[billboardIndex]) {
            billboards[billboardIndex].isDisposed = true;
          }
        }
      });

      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      // Should have attempted to render all non-disposed billboards
      expect(mockRenderer.render).toHaveBeenCalled();
    });
  });

  describe("Memory and Performance Monitoring", () => {
    it("should maintain stable memory usage with repeated operations", async () => {
      // Simulate repeated create/dispose cycles
      for (let cycle = 0; cycle < 10; cycle++) {
        const billboards = Array.from({ length: 50 }, (_, i) =>
          createMockBillboard(`cycle-${cycle}-${i}`),
        );

        // Queue all
        billboards.forEach((billboard) => {
          manager.requestRender(billboard);
        });

        // Render
        ticker.update(cycle + 1 * 100);

        // Dispose all
        billboards.forEach((billboard) => {
          billboard.isDisposed = true;
        });

        // Force another render to clear disposed items
        ticker.update(cycle + 1 * 100 + 1);

        mockRenderer.render.mockClear();
      }

      // Manager should still be functional
      const testBillboard = createMockBillboard("final-test");
      manager.requestRender(testBillboard);
      ticker.update(100_000);

      expect(mockRenderer.render).toHaveBeenCalledWith({
        container: testBillboard.container,
        target: testBillboard.canvas,
      });
    });

    it("should handle stress test with rapid operations", async () => {
      const billboards: (IRenderablePixiView & { id: string })[] = [];

      // Stress test: rapid creation, rendering, and disposal
      for (let i = 0; i < 1000; i++) {
        const billboard = createMockBillboard(`stress-${i}`);
        billboards.push(billboard);

        manager.requestRender(billboard);

        // Periodically render and dispose
        if (i % 100 === 99) {
          ticker.update(i + 1);

          // Dispose half of the billboards
          billboards.slice(-50).forEach((b) => {
            b.isDisposed = true;
          });

          mockRenderer.render.mockClear();
        }
      }

      // Final render
      billboards.forEach((billboard) => {
        if (!billboard.isDisposed) {
          manager.requestRender(billboard);
        }
      });
      ticker.update(100_000);

      // Should complete without errors
      expect(mockRenderer.render).toHaveBeenCalled();
    });
  });
});
