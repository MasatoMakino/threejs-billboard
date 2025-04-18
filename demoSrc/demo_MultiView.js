import { autoDetectRenderer, Container, Graphics, RendererType } from "pixi.js";

window.onload = async () => {
  document.body.style.backgroundColor = "#333"; // 背景色を黒に設定

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
    // canvas.style.border = "1px solid black"; // 見やすくするためにボーダーを追加
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
  const stage = new Container();
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
    stage.addChild(container); // stageにコンテナを追加
    container.renderable = false; // 初期状態では描画しない
  }

  // 各Canvasにクリックイベントリスナーを追加
  canvasData.forEach(({ canvas, container, graphics }, index) => {
    canvas.addEventListener("click", () => {
      console.log(`Canvas ${index} clicked. Re-rendering...`);

      // クリックされたCanvasのグラデーションの色を変更
      const newColor = Math.random() * 0xffffff;

      drawCircle(graphics, canvas.width / 2, newColor);
      renderCanvas(renderer, stage, canvas, mainCanvas, container, graphics); // クリックされたCanvasを再描画
    });
  });

  // 初回レンダリング前にensureCanvasSizeを呼び出す
  if (renderer.type === RendererType.WEBGL && renderer.context.multiView) {
    canvasData.forEach(({ canvas, graphics }) => {
      renderer.context.ensureCanvasSize(canvas);
      graphics.position.y = mainCanvas.height - graphics.height; // 位置を調整
    });
  }
  // 初回レンダリング
  canvasData.forEach(({ canvas, container, graphics }) => {
    renderCanvas(renderer, stage, canvas, mainCanvas, container, graphics); // 全てのCanvasを初回レンダリング
  });
};

const drawCircle = (graphics, radius, color) => {
  graphics.clear().circle(radius, radius, radius).fill({ color, alpha: 0.5 });
};

const renderCanvas = (
  renderer,
  stage,
  canvas,
  mainCanvas,
  container,
  graphics,
) => {
  const clear = (canvas) => {
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  graphics.position.y = mainCanvas.height - graphics.height; // 位置を調整
  container.renderable = true; // 再描画を許可

  clear(canvas);
  clear(mainCanvas); // mainCanvasもクリア
  renderer.render(stage); // stageを再レンダリン
  renderer.render({ container, target: canvas });
  container.renderable = false; // 再描画を防ぐ
};
