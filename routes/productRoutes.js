const express = require('express');
const router = express.Router();
const checkApiKey = require('../middleware/apiKeyMiddleware'); // Import middleware

// GET all products
router.get('/products', async (req, res) => {
  try {
    const [products] = await req.db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// POST /api/products (Create a new product)
router.post('/products', checkApiKey, async (req, res) => {
  console.log('Request Body:', req.body); // Log for debugging
  const { productName, productDesc, productID, price, stock, image } = req.body;

  try {
    await req.db.query(
      'INSERT INTO products (productName, productDesc, productID, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
      [productName, productDesc, productID, price, stock, image]
    );
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ message: 'Error adding product', error: err });
  }
});

// PATCH /api/products/:id (Update a product by ID)
router.patch('/products/:id', checkApiKey, async (req, res) => {
  const { productName, productDesc, price, stock, image } = req.body;
  try {
    await req.db.query(
      'UPDATE products SET productName = ?, productDesc = ?, price = ?, stock = ?, image = ? WHERE id = ?',
      [productName, productDesc, price, stock, image, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err });
  }
});

// DELETE /api/products/:id (Delete a product by ID)
router.delete('/products/:id', checkApiKey, async (req, res) => {
  try {
    await req.db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
});

module.exports = router;
