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
  const { userid, ...updateFields } = req.body; // Extract userid separately

  if (!userid) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  try {
      // Check if user exists
      const [existingUser] = await req.db.query('SELECT * FROM users WHERE userid = ?', [userid]);

      if (existingUser.length > 0) {
          // User exists, update only provided fields
          const updateKeys = Object.keys(updateFields);
          if (updateKeys.length === 0) {
              return res.status(400).json({ message: 'No valid fields to update' });
          }

          const setClause = updateKeys.map(key => `${key} = ?`).join(', ');
          const values = updateKeys.map(key => updateFields[key]);

          await req.db.query(`UPDATE users SET ${setClause} WHERE userid = ?`, [...values, userid]);

          return res.json({ message: 'User updated successfully' });
      } else {
          // User doesn't exist, create a new one
          const defaultValues = {
              username: '',
              avatar: '',
              discordid: '',
              ownedProducts: '',
              borrowedProducts: '',
              Link: '',
              Linked: "false",
              ...updateFields // Override defaults with provided values
          };

          await req.db.query(
              'INSERT INTO users (userid, username, discordid, avatar, ownedProducts, borrowedProducts, Link, Linked) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [userid, defaultValues.username, defaultValues.avatar, defaultValues.discordid, defaultValues.ownedProducts, defaultValues.borrowedProducts, defaultValues.Link, defaultValues.Linked]
          );

          return res.status(201).json({ message: 'User created successfully' });
      }
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: 'Error processing user data', error: err.sqlMessage || err.message });
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
