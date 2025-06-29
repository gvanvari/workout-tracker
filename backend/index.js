const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory storage for sets and exercise history
let sets = [];
let exerciseHistory = [];

// Simple login endpoint
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === 'yourPassword') {
    res.json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});

// Add a new set (matches /add-set)
app.post('/api/add-set', (req, res) => {
  const set = req.body;
  sets.push(set);
  res.json(set);
});

// Get exercise history (matches /exercise-history)
app.get('/api/exercise-history', (req, res) => {
  res.json(exerciseHistory);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});