// /models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  assignedProducts: {
    type: [String],
    required: true,
  },
});

// Specify the collection name explicitly
const Staff = mongoose.model('Staff', staffSchema, 'staff');  // 'staff' is the collection name

module.exports = Staff;
