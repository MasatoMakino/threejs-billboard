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
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe("Rapid Operations Edge Cases", () => {
    it("renders a view once per tick however often it is requested, so that repeated updateContent calls cost one render", async () => {
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

      for (let i = 0; i < 100; i++) {
        manager.requestRender(mockInstance);
      }

      ticker.update(1);

      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });

    it("dispose drops pending render requests, so that nothing renders with a destroyed renderer", async () => {
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

      manager.dispose();

      expect(() => {
        ticker.update(1);
      }).not.toThrow();

      expect(mockRenderer.render).not.toHaveBeenCalled();
    });
  });
});
