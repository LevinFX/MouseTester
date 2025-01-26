const express = require('express');
const db = require('./database');
const hardware = require('./hardware');

const app = express();
app.use(express.json());

// Automatisierte Tests
app.post('/api/tests/polling', async (req, res) => {
  try {
    hardware.startPollingTest();
    setTimeout(async () => {
      const rate = hardware.calculatePollingRate();
      await db.saveAutomatedTest(req.body.profileId, 'polling', rate);
      res.json({ value: rate });
    }, 5000);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/tests/dpi', async (req, res) => {
  const dpi = hardware.measureDPI(req.body.distanceCM);
  await db.saveAutomatedTest(req.body.profileId, 'dpi', dpi);
  res.json({ value: dpi });
});

// Manuelle Bewertungen
app.post('/api/ratings', async (req, res) => {
  const validation = validateRatings(req.body);
  if (!validation.valid) return res.status(400).json(validation);

  try {
    await db.saveManualRating(req.body);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

function validateRatings(data) {
  const errors = [];
  const fields = [
    'comfort', 'build_quality', 'cable_quality',
    'button_quality', 'material_quality', 'software_quality'
  ];

  fields.forEach(field => {
    if (data[field] && (data[field] < 1.0 || data[field] > 6.0)) {
      errors.push(`${field} out of range`);
    }
  });

  return { valid: errors.length === 0, errors };
}