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
    vi.clearAllMocks();
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

  describe("Resource Limits and Constraints", () => {
    it("propagates a renderer resize error out of the ticker update, so that GPU exhaustion is not silently ignored", async () => {
      // Simulate resource exhaustion by making resize throw
      mockRenderer.resize.mockImplementation(() => {
        throw new Error("GPU memory exhausted");
      });

      const billboard = createMockBillboard("exhaustion-test", 1000, 1000);

      expect(() => {
        manager.requestRender(billboard);
        ticker.update(1);
      }).toThrow("GPU memory exhausted");

      expect(mockRenderer.resize).toHaveBeenCalled();
    });
  });
});
