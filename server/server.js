const express = require('express');
const path = require('path');
const db = require('./database');
const hardware = require('./hardware');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API-Endpunkte

// Profile
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await db.getProfiles();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profiles', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const profile = await db.createProfile(name);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tests
app.post('/api/tests', async (req, res) => {
  const { profileId, type, distance_cm } = req.body;
  if (!profileId || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let result;
    switch (type) {
      case 'polling':
        result = await hardware.runPollingTest();
        break;
      case 'dpi':
        if (!distance_cm) {
          return res.status(400).json({ error: 'Distance is required for DPI test' });
        }
        result = await hardware.runDpiTest(distance_cm);
        break;
      default:
        return res.status(400).json({ error: 'Invalid test type' });
    }

    const test = await db.createTest(profileId, type, result.value);
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});