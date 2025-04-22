import { autoDetectRenderer, Container, Graphics } from "pixi.js";

window.onload = async () => {
  document.body.style.backgroundColor = "#333"; // 背景色を黒に設定

  // 異なるサイズの32個のCanvas要素を生成し、DOMに追加
  const canvasContainer = document.createElement("div");
  document.body.appendChild(canvasContainer);

  const canvases = [];
  for (let i = 0; i < 32; i++) {
    const canvas = document.createElement("canvas");
    const size = 50 + i * 10; // サイズを変化させる例
    canvas.width = size;
    canvas.height = size;
    canvasContainer.appendChild(canvas);
    canvases.push(canvas);
  }

  // PixiJSレンダラーを生成 (multiView: true)
  const renderer = await autoDetectRenderer({
    preference: "webgl",
    multiView: true,
    backgroundAlpha: 0,
  });
  document.body.appendChild(renderer.canvas);
  const mainCanvas = renderer.canvas;

  // 各Canvasに対応するコンテナとグラデーションを作成
  const canvasData = [];
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const width = canvas.width;
    const container = new Container();

    const color1 = (i / 31) * 0xffffff; // Canvasごとに色を変化させる
    const graphics = new Graphics();
    drawCircle(graphics, width / 2, color1); // 円を描画

    // 簡単のため単色塗りつぶしにしていますが、必要に応じてcreateLinearGradientなどでグラデーションを実装
    // PixiJSのGraphicsで複雑なグラデーションを描画するにはシェーダーなどが必要になるため、ここでは簡易的に単色で区別します。
    // もし複雑なグラデーションが必要な場合は、Canvas APIで描画したものをテクスチャとして使う方が容易かもしれません。

    container.addChild(graphics);
    canvasData.push({ canvas, container, graphics }); // graphicsも保持
    container.renderable = false; // 初期状態では描画しない
  }

  // 各Canvasにクリックイベントリスナーを追加
  canvasData.forEach(({ canvas, container, graphics }, index) => {
    canvas.addEventListener("click", () => {
      console.log(`Canvas ${index} clicked. Re-rendering...`);

      // クリックされたCanvasのグラデーションの色を変更
      const newColor = Math.random() * 0xffffff;
      drawCircle(graphics, canvas.width / 2, newColor);
      renderCanvas(renderer, canvas, container); // Canvasを再描画
    });
  });

  // 初回レンダリング
  canvasData.forEach(({ canvas, container, graphics }) => {
    renderCanvas(renderer, canvas, container); // 全てのCanvasを初回レンダリング
  });
};

const drawCircle = (graphics, radius, color) => {
  graphics.clear().circle(radius, radius, radius).fill({ color, alpha: 0.5 });
};

const renderCanvas = (renderer, canvas, container) => {
  const w = Math.max(canvas.width, renderer.canvas.width);
  const h = Math.max(canvas.height, renderer.canvas.height);
  if (canvas.width !== w || canvas.height !== h) {
    renderer.resize(w, h); // サイズをCanvasに合わせる
  }
  renderer.render({ container, target: canvas });
};
