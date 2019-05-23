const { exec } = require("child_process");

const tsc = cb => {
  const callback = onCompleteExecTask(cb);
  const child = exec("npx tsc", callback);
  child.stdout.on("data", onStdOut);
};

const watchTsc = () => {
  const callback = onCompleteExecTask();
  const child = exec("npx tsc -w", callback);
  child.stdout.on("data", onStdOut);
};

const onCompleteExecTask = cb => {
  return (error, stdout, stderr) => {
    if (error) {
      console.error(`[ERROR] ${error}`);
      return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.log(`stderr: ${stderr}`);
    if (cb) cb();
  };
};

const onStdOut = data => {
  let msg = Buffer.from(data, "utf-8")
    .toString()
    .trim();

  //FIXME : 行頭に制御文字？「c」が入ることがある。なんの意味なのか不明。なお本家tscにもある。
  msg = msg.replace(/^c/, "");
  if (msg === "") return;
  if (msg == null) return;

  if (msg.includes(": error")) {
    console.error(msg);
  } else {
    console.log(msg);
  }
};

exports.tsc = tsc;
exports.watchTsc = watchTsc;
