const path = require("path");
const bs = require("browser-sync").create();

const distDir = path.resolve(process.cwd(), "docs/demo");

bs.init({
  server: distDir,
  watch: true
});
