"use strict";

const { series } = require("gulp");

const server = require("gulptask-dev-server").generateTask("./docs/demo");
exports.server = server;

const { bundleDemo, watchDemo } = require("gulptask-demo-page").generateTasks({
  body: `<canvas id="webgl-canvas" width="640" height="480"></canvas>`,
});

const { tsc, watchTsc, tscClean } = require("gulptask-tsc").generateTasks({
  projects: ["tsconfig.json", "tsconfig.esm.json"],
});

const watchTasks = async () => {
  watchDemo();
  watchTsc();
};

exports.bundleDemo = bundleDemo;
exports.watchTasks = watchTasks;
exports.start_dev = series(watchTasks, server);
exports.build = tsc;
exports.build_clean = tscClean;
