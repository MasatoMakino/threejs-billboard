import * as pixi from "pixi.js";
import { Ticker } from "pixi.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PixiMultiViewManager } from "../src/PixiMultiViewManager.js";

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

    manager = new PixiMultiViewManager({ ticker });
  });

  afterEach(() => {
    if (manager && !manager.isDisposed) {
      manager.dispose();
    }
    ticker.destroy();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe("Renderer Initialization Failures", () => {
    it("init rejects with the renderer error and leaves renderer null, so that callers can detect missing WebGL", async () => {
      const mockError = new Error("WebGL not supported");
      vi.mocked(pixi.autoDetectRenderer).mockRejectedValue(mockError);

      await expect(manager.init()).rejects.toThrow("WebGL not supported");
      expect(manager.renderer).toBeNull();
    });
  });
});
