// /routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const checkApiKey = require('../middleware/apiKeyMiddleware');  // Import the middleware

// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/products (Create a new product) — Protected by API Key Middleware
router.post('/products', checkApiKey, async (req, res) => {
  console.log('Request Body:', req.body); // Log the incoming request body for debugging
  const { productName, productDesc, productID, price, stock, image } = req.body;
  const newProduct = new Product({
    productName,
    productDesc,
    productID,
    price,
    stock,
    image,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err); // Log any errors
    res.status(400).json({ message: err.message });
  }
});


// PATCH /api/products/:id (Update a product by ID) — Protected by API Key Middleware
router.patch('/products/:id', checkApiKey, async (req, res) => {  // Add the middleware here
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id (Delete a product by ID) — Protected by API Key Middleware
router.delete('/products/:id', checkApiKey, async (req, res) => {  // Add the middleware here
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
