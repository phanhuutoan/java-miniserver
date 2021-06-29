const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const fs = require('fs');
const { runCode } = require('./runCode');

const app = express();

app.use(express.json());

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('HELLO FROM JAVA');
});

app.post('/java/playground', (req, res) => {
  const { code } = req.body;
  const dirName = '/home/app/javaFiles/temp_' + Date.now();
  const className = 'Main'
  fs.mkdirSync(dirName)
  const path = `${dirName}/${className}.java`
  fs.writeFileSync(path, code);

  let result;

  try {
    const { stderr, stdout, executeTime } = runCode(dirName, className);
    stdout && (result = { status: 'success', result: stdout, executeTime });
    stderr && (result = { status: 'error', result: stderr, executeTime });

    res.json(result);
  } catch (err) {
    console.log(`Exception occurred!!!`, err);
  }
});

app.post('/java/test', (req, res) => {
  const { code, command } = req.body;
  const name = `${v4()}.js`;
  fs.writeFileSync(name, code);
  fs.appendFileSync(name, `\n ${command}`);

  let result;
  try {
    const { stderr, stdout, executeTime } = runCode(name);
    stdout && (result = { status: 'success', result: stdout, executeTime });
    stderr && (result = { status: 'error', result: stderr, executeTime });

    res.json(result);
    fs.unlinkSync(name);
  } catch (err) {
    fs.unlinkSync(name);
    console.log(`Exception occurred!!!`, err);
  }
});

app.listen(6002, () => {
  console.log('Java mini server listen from 6002');
});
