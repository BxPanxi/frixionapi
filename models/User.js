// /models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  ownedProducts: {
    type: [String],
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
