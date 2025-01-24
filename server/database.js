const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mice.db');

// Tabellen erstellen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('polling', 'dpi', 'weight', 'lift_off')) NOT NULL,
      value REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(profile_id) REFERENCES profiles(id)
    )
  `);
});

// Profile
function getProfiles() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM profiles', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function createProfile(name) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO profiles (name) VALUES (?)',
      [name],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name });
      }
    );
  });
}

// Tests
function createTest(profileId, type, value) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tests (profile_id, type, value) VALUES (?, ?, ?)',
      [profileId, type, value],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, profileId, type, value });
      }
    );
  });
}

module.exports = { getProfiles, createProfile, createTest };