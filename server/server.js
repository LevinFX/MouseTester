const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Polling Rate Test Endpoint
app.post('/api/test/polling', (req, res) => {
  const devicePath = req.body.device;
  
  const evtest = exec(`evtest --grab ${devicePath}`, { timeout: 5000 });
  let eventCount = 0;
  let startTime = Date.now();

  evtest.stdout.on('data', (data) => {
    eventCount += (data.match(/Event:/g) || []).length;
  });

  setTimeout(() => {
    evtest.kill();
    const duration = (Date.now() - startTime) / 1000;
    const rate = Math.round(eventCount / duration);
    res.json({ polling_rate: rate });
  }, 3000);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});