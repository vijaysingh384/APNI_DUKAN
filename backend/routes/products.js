import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// In-memory product storage (replace with database)
let products = [];

// @route   GET /api/products
// @desc    Get all products (with optional shop filter)
// @access  Public
router.get('/', optionalAuth, (req, res) => {
  let filteredProducts = [...products];
  
  if (req.query.shopId) {
    filteredProducts = filteredProducts.filter(p => p.shopId === req.query.shopId);
  }
  
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
  }
  
  res.json({ products: filteredProducts });
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', optionalAuth, (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Shopkeeper)
router.post(
  '/',
  authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('shopId').trim().notEmpty().withMessage('Shop ID is required'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is a shopkeeper
      if (req.user.role !== 'shopkeeper') {
        return res.status(403).json({ message: 'Only shopkeepers can create products' });
      }

      const product = {
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category,
        shopId: req.body.shopId,
        image: req.body.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop',
        inStock: req.body.stock ? parseInt(req.body.stock) > 0 : true,
        stock: req.body.stock ? parseInt(req.body.stock) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.push(product);
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Shopkeeper - owner of shop)
router.put(
  '/:id',
  authenticateToken,
  [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productIndex = products.findIndex(p => p.id === req.params.id);
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const product = products[productIndex];
      
      // In a real app, verify user owns the shop that owns this product
      // For now, just check if user is shopkeeper
      if (req.user.role !== 'shopkeeper') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Update product
      Object.assign(product, req.body, {
        updatedAt: new Date().toISOString(),
      });

      if (req.body.stock !== undefined) {
        product.inStock = parseInt(req.body.stock) > 0;
        product.stock = parseInt(req.body.stock);
      }

      res.json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Shopkeeper - owner of shop)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // In a real app, verify user owns the shop that owns this product
    if (req.user.role !== 'shopkeeper') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

