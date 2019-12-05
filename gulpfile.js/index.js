"use strict";

const { src, dest, series, watch } = require("gulp");

const doc = require("gulptask-tsdoc").get();
exports.doc = doc;

const server = require("gulptask-dev-server").get("./docs/demo");
exports.server = server;

const copyGlob = "./demoSrc/**/*.{html,png,jpg,jpeg}";
const copy = () => {
  return src(copyGlob, { base: "./demoSrc/" }).pipe(dest("./docs/demo"));
};

const { bundleDevelopment, watchBundle } = require("gulptask-webpack")(
  "./webpack.config.js"
);
exports.bundleDevelopment = bundleDevelopment;

const { tsc, watchTsc } = require("gulptask-tsc").get();

const watchTasks = cb => {
  watchBundle();
  watchTsc();
  watch(copyGlob, copy);
  cb();
};
exports.watchTasks = watchTasks;

exports.start_dev = series(watchTasks, server);

exports.build = series(tsc, copy, bundleDevelopment, doc);
