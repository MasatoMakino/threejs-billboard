const { src, dest, watch, series } = require("gulp");
const typedoc = require("gulp-typedoc");
const replace = require("gulp-replace");
const path = require("path");

module.exports = option => {
  if (option == null) option = {};
  if (option.srcDir == null) option.srcDir = "./src";
  if (option.destDir == null) option.destDir = "./docs/api";
  const {srcDir,destDir} = option;

  const docTask = () => {
    const srcGlob = path.resolve(process.cwd(), srcDir, "**/*.ts");
    const option = require("./tsdocconfig");
    option.out = destDir;
    option.baseUrl = srcDir;
    return src(srcGlob).pipe(typedoc(option));
  };

  const replaceTask = () => {
    const srcGlob = path.resolve(process.cwd(), destDir, "**/*.html");
    return src(srcGlob)
      .pipe(replace(/\/Users.*node_modules\//g, "node_modules/"))
      .pipe(dest(destDir));
  };

  return series(docTask, replaceTask);
};
