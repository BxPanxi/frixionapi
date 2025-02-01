const express = require('express');
const router = express.Router();
const checkApiKey = require('../middleware/apiKeyMiddleware'); // Import middleware

// Get all users or a specific user by ID
router.get('/users/:id?', checkApiKey, async (req, res) => {
  try {
    if (req.params.id) {
      // Fetch a specific user by ID
      const [user] = await req.db.query('SELECT * FROM users WHERE userid = ?', [req.params.id]);

      if (user.length === 0) {
        return res.json(false); // Instead of 404, return false
      }

      res.json(user[0]); // Return the first (and only) user found
    } else {
      // Fetch all users if no ID is provided
      const [users] = await req.db.query('SELECT * FROM users');
      res.json(users);
    }
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// Create a new user
router.post('/users', checkApiKey, async (req, res) => {
  const { username, userid, avatar, ownedProducts, borrowedProducts } = req.body;
  try {
    await req.db.query(
      'INSERT INTO users (username, userid, avatar, ownedProducts, borrowedProducts) VALUES (?, ?, ?, ?, ?)',
      [username, userid, avatar, ownedProducts.join(','), borrowedProducts.join(',')]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding user', error: err });
  }
});

// Update a user by ID
router.patch('/users/:id', checkApiKey, async (req, res) => {
  const { username, avatar, ownedProducts, borrowedProducts } = req.body;
  try {
    await req.db.query(
      'UPDATE users SET username = ?, avatar = ?, ownedProducts = ?, borrowedProducts = ? WHERE id = ?',
      [username, avatar, ownedProducts.join(','), borrowedProducts.join(','), req.params.id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
});

// Delete a user by ID
router.delete('/users/:id', checkApiKey, async (req, res) => {
  try {
    await req.db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

module.exports = router;
