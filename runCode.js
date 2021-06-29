const { spawnSync } = require('child_process');

exports.runCode = (dirName, className) => {
  const start = Date.now();
  try {
    const jsProcess = spawnSync('./runJavaCode.sh', [dirName, className]);
    const stdout = jsProcess.stdout.toString().trim().split('\n');
    const stderr = jsProcess.stderr.toString().trim();

    const finish = Date.now();
    return {
      stderr: stderr ? [stderr] : null,
      stdout,
      executeTime: finish - start,
    };
  } catch (err) {
    throw new Error('Error Occur', err);
  }
};
