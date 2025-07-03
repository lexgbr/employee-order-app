const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REGISTRATION_CODE = process.env.REG_CODE || 'JOIN-ORDER-APP-2025';

router.post('/register', async (req, res) => {
  const { username, password, numeAngajat, code } = req.body;

  console.log('🛠 Registration Input:', { username, password, numeAngajat, code });

  if (code !== REGISTRATION_CODE) {
    console.log('❌ Invalid registration code:', code);
    return res.status(403).json({ error: 'Invalid registration code' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, numeAngajat });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('❌ Registration failed:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(400).json({ error: err.message || 'Invalid input' });
    }
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, numeAngajat: user.numeAngajat }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, numeAngajat: user.numeAngajat });
});

module.exports = router;
