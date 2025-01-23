const express = require('express');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Polling Rate Test (evhz)
app.get('/polling-rate', (req, res) => {
    exec('sudo evhz /dev/input/eventX', (error, stdout, stderr) => {
        if (error) return res.status(500).send(stderr);
        res.send(stdout);
    });
});

// Save Ergonomics
app.post('/save-ergonomics', (req, res) => {
    const { comfort, buildQuality } = req.body;
    const db = new sqlite3.Database('./results.db');
    db.run(`INSERT INTO ergonomics (comfort, buildQuality) VALUES (?, ?)`, [comfort, buildQuality], (err) => {
        if (err) return res.status(500).send(err.message);
        res.send('Ergebnisse gespeichert');
    });
    db.close();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
