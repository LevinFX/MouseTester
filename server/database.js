const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mice.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device TEXT,
      polling_rate INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function saveTestResult(device, pollingRate) {
  db.run(
    'INSERT INTO tests (device, polling_rate) VALUES (?, ?)',
    [device, pollingRate]
  );
}

module.exports = { saveTestResult };