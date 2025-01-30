// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkApiKey = require('../middleware/apiKeyMiddleware');  // Import the middleware

// Get all users
router.get('/users', checkApiKey, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/users (Create a new user) — Protected by API Key Middleware
router.post('/users', checkApiKey, async (req, res) => {  // Add the middleware here
  const { username, userid, avatar, ownedProducts } = req.body;
  const newUser = new User({ username, userid, avatar, ownedProducts });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/users/:id (Update a user by ID) — Protected by API Key Middleware
router.patch('/users/:id', checkApiKey, async (req, res) => {  // Add the middleware here
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/users/:id (Delete a user by ID) — Protected by API Key Middleware
router.delete('/users/:id', checkApiKey, async (req, res) => {  // Add the middleware here
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
