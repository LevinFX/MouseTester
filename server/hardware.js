const { exec } = require('child_process');

function runPollingTest() {
  return new Promise((resolve, reject) => {
    const evtest = exec('evtest --grab /dev/input/event3', { timeout: 5000 });
    let eventCount = 0;
    let startTime = Date.now();

    evtest.stdout.on('data', (data) => {
      eventCount += (data.match(/Event:/g) || []).length;
    });

    setTimeout(() => {
      evtest.kill();
      const duration = (Date.now() - startTime) / 1000;
      const rate = Math.round(eventCount / duration);
      resolve({ value: rate });
    }, 3000);
  });
}

function runDpiTest(distance_cm) {
  return new Promise((resolve, reject) => {
    exec(`./server/scripts/dpi_test.sh ${distance_cm}`, (error, stdout) => {
      if (error) return reject(error);
      const dpi = parseInt(stdout.match(/DPI: (\d+)/)[1]);
      resolve({ value: dpi });
    });
  });
}

module.exports = { runPollingTest, runDpiTest };