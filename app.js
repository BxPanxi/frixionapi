// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const staffRoutes = require('./routes/staffRoutes');

// Use routes with /api prefix
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', staffRoutes);
app.use('/web', express.static(path.join(__dirname, 'web')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
