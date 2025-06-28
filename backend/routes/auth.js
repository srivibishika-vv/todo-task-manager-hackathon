const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Define schema for user
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  name: String,
  picture: String,
}));

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, picture });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token: jwtToken });

  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
