"use strict";

const { watch, src, dest, parallel, series } = require("gulp");

const doc = require("gulptask-tsdoc")();
exports.doc = doc;

const server = require("gulptask-dev-server")("./docs/demo");
exports.server = server;

const { bundleDevelopment, watchBundle } = require("gulptask-webpack")(
  "./webpack.config.js"
);
exports.bundleDevelopment = bundleDevelopment;

const watchTasks = cb => {
  watchBundle();
  cb();
};
exports.watchTasks = watchTasks;

exports.start_dev = series(watchTasks, server);

exports.build = series(bundleDevelopment, doc);
