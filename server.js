
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');
const User = require('./models/user');
const HealthAssessment = require('./models/healthAssessment');


connectDB();

const app = express();


app.use(express.json());
app.use(cors({
  origin: '*', // Be more restrictive in production
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Username or email already exists'
      });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
      res.json({
        message: 'Login successful',
        username: user.username
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/health-assessment', async (req, res) => {
  try {
    const {
      username,
      gender,
      weight,
      height,
      bloodPressure,
      oxygenSaturation,
      recommendations
    } = req.body;

    const healthAssessment = new HealthAssessment({
      username,
      gender,
      weight,
      height,
      bloodPressure,
      oxygenSaturation,
      recommendations
    });

    await healthAssessment.save();

    res.status(201).json({
      message: 'Health assessment saved successfully'
    });
  } catch (error) {
    console.error('Error saving health assessment:', error);
    res.status(500).json({ error: 'Error saving assessment' });
  }
});


app.get('/user-health-history/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const history = await HealthAssessment.find({ username })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(history);
  } catch (error) {
    console.error('Error fetching health history:', error);
    res.status(500).json({ error: 'Error fetching health history' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));