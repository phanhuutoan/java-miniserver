const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");
const fs = require("fs");
const { runCode } = require("./runCode");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/hello", (req, res) => {
  res.send("HELLO FROM JAVA");
});

function writeCodeToFile(code) {
  const dirName = "/home/app/javaFiles/temp_" + Date.now();
  const className = "Main";
  fs.mkdirSync(dirName);
  const path = `${dirName}/${className}.java`;
  fs.writeFileSync(path, code);
  return { dirName, className };
}

function injectTheMainFunctionCode(code, command) {
  const mainPattern = /main/;
  code = code.replace(mainPattern, "dummyFunc");
  const index = code.indexOf("public static void dummyFunc(String[] Args)");
  code = [code.slice(0, index), command, code.slice(index)].join("");
  return code;
}

app.post("/java/playground", (req, res) => {
  const { code } = req.body;
  let result;

  const { dirName, className } = writeCodeToFile(code);

  try {
    const { stderr, stdout, executeTime } = runCode(dirName, className);
    stdout && (result = { status: "success", result: stdout, executeTime });
    stderr && (result = { status: "error", result: stderr, executeTime });

    res.json(result);
  } catch (err) {
    console.log(`Exception occurred!!!`, err);
  }
});

app.post("/java/test", (req, res) => {
  const { code, command } = req.body;
  const newCode = injectTheMainFunctionCode(code, command);

  const { dirName, className } = writeCodeToFile(newCode);

  let result;
  try {
    const { stderr, stdout, executeTime } = runCode(dirName, className);
    stdout && (result = { status: "success", result: stdout, executeTime });
    stderr && (result = { status: "error", result: stderr, executeTime });

    res.json(result);
  } catch (err) {
    console.log(`Exception occurred!!!`, err);
  }
});

app.listen(6002, () => {
  console.log("Java mini server listen from 6002");
});
