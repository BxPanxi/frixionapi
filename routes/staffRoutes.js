// /routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const checkApiKey = require('../middleware/apiKeyMiddleware');  // Import the middleware

// GET all staff
router.get('/staff', checkApiKey, async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/staff (Create a new staff member) — Protected by API Key Middleware
router.post('/staff', checkApiKey, async (req, res) => {  // Add the middleware here
  const { staffID, name, role, assignedProducts } = req.body;
  const newStaff = new Staff({ staffID, name, role, assignedProducts });

  try {
    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/staff/:id (Update a staff member by ID) — Protected by API Key Middleware
router.patch('/staff/:id', checkApiKey, async (req, res) => {  // Add the middleware here
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/staff/:id (Delete a staff member by ID) — Protected by API Key Middleware
router.delete('/staff/:id', checkApiKey, async (req, res) => {  // Add the middleware here
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
