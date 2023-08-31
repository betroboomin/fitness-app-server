const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models/usersModel');
const router = express.Router();
const config = require('./config');



// Get the user's credentials
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Users.findOne({ email });

    // If user not found or password doesn't match, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, 'secret-key', { expiresIn: '1h' });

    // Return the token
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Protect a route to ensure only authenticated users can access it
  router.get('/protected', isAuthenticated, function(req, res) {
    res.send('You are authenticated!');
  });

  // Middleware function to check if the user is authenticated
  function isAuthenticated(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
console.log(token);
    try {
      const decoded = jwt.verify(token, config.secret);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).json({ message: 'Invalid token' });
    }
  }

module.exports = router;