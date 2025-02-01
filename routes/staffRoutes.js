const express = require('express');
const router = express.Router();
const checkApiKey = require('../middleware/apiKeyMiddleware'); // Import middleware

// GET all staff members
router.get('/staff', checkApiKey, async (req, res) => {
  try {
    const [staff] = await req.db.query('SELECT * FROM staff');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// POST /api/staff (Create a new staff member)
router.post('/staff', checkApiKey, async (req, res) => {
  const { staffID, name, role, assignedProducts } = req.body;
  try {
    await req.db.query(
      'INSERT INTO staff (staffID, name, role, assignedProducts) VALUES (?, ?, ?, ?)',
      [staffID, name, role, assignedProducts.join(',')]
    );
    res.status(201).json({ message: 'Staff member created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding staff member', error: err });
  }
});

// PATCH /api/staff/:id (Update a staff member by ID)
router.patch('/staff/:id', checkApiKey, async (req, res) => {
  const { name, role, assignedProducts } = req.body;
  try {
    await req.db.query(
      'UPDATE staff SET name = ?, role = ?, assignedProducts = ? WHERE id = ?',
      [name, role, assignedProducts.join(','), req.params.id]
    );
    res.json({ message: 'Staff member updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating staff member', error: err });
  }
});

// DELETE /api/staff/:id (Delete a staff member by ID)
router.delete('/staff/:id', checkApiKey, async (req, res) => {
  try {
    await req.db.query('DELETE FROM staff WHERE id = ?', [req.params.id]);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting staff member', error: err });
  }
});

module.exports = router;
