"use strict";

const { series, parallel } = require("gulp");

const doc = require("gulptask-tsdoc").get();
exports.doc = doc;

const server = require("gulptask-dev-server").get("./docs/demo");
exports.server = server;

const { bundleDemo, watchDemo } = require("gulptask-demo-page").get({
  externalScripts: ["https://code.createjs.com/1.0.0/createjs.min.js"],
  body: `<canvas id="webgl-canvas" width="640" height="480"></canvas>`,
});

const { tsc, watchTsc, tscClean } = require("gulptask-tsc").get({
  projects: ["tsconfig.json", "tsconfig.esm.json"],
});

const watchTasks = async () => {
  watchDemo();
  watchTsc();
};

exports.watchTasks = watchTasks;
exports.start_dev = series(watchTasks, server);
exports.build = series(tsc, parallel(bundleDemo, doc));
exports.build_clean = series(tscClean, parallel(bundleDemo, doc));
