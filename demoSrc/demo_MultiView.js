import {
  autoDetectRenderer,
  Container,
  Graphics,
  RendererType,
  Text,
  Ticker,
} from "pixi.js";
import { contain } from "three/src/extras/TextureUtils.js";

window.onload = async () => {
  // 既存のthree.js用Canvas要素を削除
  const threeJSCanvas = document.getElementById("webgl-canvas");
  if (threeJSCanvas) {
    threeJSCanvas.remove();
  }

  // 異なるサイズの32個のCanvas要素を生成し、DOMに追加
  const canvasContainer = document.createElement("div");
  document.body.appendChild(canvasContainer);

  const canvases = [];
  for (let i = 0; i < 32; i++) {
    const canvas = document.createElement("canvas");
    const size = 50 + i * 10; // サイズを変化させる例
    canvas.width = size;
    canvas.height = size;
    canvas.style.border = "1px solid black"; // 見やすくするためにボーダーを追加
    canvasContainer.appendChild(canvas);
    canvases.push(canvas);
  }

  // PixiJSレンダラーを生成 (multiView: true)
  const renderer = await autoDetectRenderer({
    preference: "webgl",
    multiView: true,
    backgroundColor: 0xcccccc,
  });
  document.body.appendChild(renderer.canvas);
  const stage = new Container();
  stage.addChild(new Graphics().rect(0, 0, 100, 600).fill("#f00")); // stageにGraphicsを追加

  // 各Canvasに対応するコンテナとグラデーションを作成
  const canvasData = [];
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const container = new Container();
    const graphics = new Graphics();

    // グラデーションを描画 (例: 左上から右下へのグラデーション)
    const color1 = (i / 31) * 0xffffff; // Canvasごとに色を変化させる
    // const color2 = ((i + 5) / 31) * 0xffffff;
    graphics.rect(0, 0, 36, 36);
    graphics.fill({ color: color1 });

    // 簡単のため単色塗りつぶしにしていますが、必要に応じてcreateLinearGradientなどでグラデーションを実装
    // PixiJSのGraphicsで複雑なグラデーションを描画するにはシェーダーなどが必要になるため、ここでは簡易的に単色で区別します。
    // もし複雑なグラデーションが必要な場合は、Canvas APIで描画したものをテクスチャとして使う方が容易かもしれません。

    container.addChild(graphics);
    canvasData.push({ canvas, container, graphics }); // graphicsも保持

    stage.addChild(container); // stageにコンテナを追加
  }

  // 各Canvasにクリックイベントリスナーを追加
  canvasData.forEach(({ canvas, container, graphics }, index) => {
    canvas.addEventListener("click", () => {
      console.log(`Canvas ${index} clicked. Re-rendering...`);

      // クリックされたCanvasのグラデーションの色を変更
      const newColor = Math.random() * 0xffffff;
      graphics
        .clear()
        .rect(0, 0, canvas.width, canvas.height)
        .fill({ color: newColor });

      // クリックされたCanvasのみを再レンダリング
      renderer.render(stage); // stageを再レンダリング
      renderer.render({ container: container, target: canvas });
    });
  });

  // 初回レンダリング前にensureCanvasSizeを呼び出す
  if (renderer.type === RendererType.WEBGL && renderer.context.multiView) {
    canvasData.forEach(({ canvas }) => {
      renderer.context.ensureCanvasSize(canvas);
    });
  }
  // 初回レンダリング
  renderer.render(stage); // 先に全体を再レンダリング
  canvasData.forEach(({ canvas, container }) => {
    renderer.render({ container, target: canvas });
  });
};
