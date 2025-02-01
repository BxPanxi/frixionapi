const express = require('express');
const mysql = require('mysql2/promise'); // Using `mysql2` for async/await support
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool using Heroku Config Vars
const db = mysql.createPool({
  uri: process.env.DATABASE_URL,  // Use your connection string here
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true  // Ensure SSL is required
  }
});
// Ensure database connection
db.getConnection()
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.error('MySQL connection error:', err));

// Make database accessible in routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const staffRoutes = require('./routes/staffRoutes');

// Use routes with /api prefix
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', staffRoutes);
app.use('/web', createProxyMiddleware({ target: 'https://localhost:8000', changeOrigin: true }));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
