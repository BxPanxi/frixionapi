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
        return res.json("None"); // Instead of 404, return false
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

// Create or Update a user
router.post('/users', checkApiKey, async (req, res) => {
  const { username, userid, avatar, ownedProducts, borrowedProducts, Link, Linked } = req.body;

  try {
    // Check if the user already exists
    const [existingUser] = await req.db.query('SELECT * FROM users WHERE userid = ?', [userid]);

    if (existingUser.length > 0) {
      // User exists, update their information
      await req.db.query(
        'UPDATE users SET username = ?, avatar = ?, ownedProducts = ?, borrowedProducts = ?, Link = ?, Linked = ? WHERE userid = ?',
        [username, avatar, ownedProducts.join(','), borrowedProducts.join(','), Link, Linked, userid]
      );
      return res.json({ message: 'User updated successfully' });
    } else {
      // User does not exist, insert new record
      await req.db.query(
        'INSERT INTO users (username, userid, avatar, ownedProducts, borrowedProducts, Link, Linked) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, userid, avatar, ownedProducts.join(','), borrowedProducts.join(','), Link, Linked]
      );
      return res.status(201).json({ message: 'User created successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing user data', error: err });
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
