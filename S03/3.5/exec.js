const exec = require("child_process").exec;

const process = exec("cmd /c chcp 65001>nul && dir");

process.stdout.on("data", function (data) {
  console.log(data.toString());
});

process.stderr.on("data", function (data) {
  console.error(data.toString());
});
