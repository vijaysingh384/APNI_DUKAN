import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// In-memory shop storage (replace with database)
let shops = [];

// @route   GET /api/shops
// @desc    Get all shops
// @access  Public
router.get('/', optionalAuth, (req, res) => {
  res.json({ shops });
});

// @route   GET /api/shops/:id
// @desc    Get shop by ID
// @access  Public
router.get('/:id', optionalAuth, (req, res) => {
  const shop = shops.find(s => s.id === req.params.id);
  if (!shop) {
    return res.status(404).json({ message: 'Shop not found' });
  }
  res.json({ shop });
});

// @route   POST /api/shops
// @desc    Create a new shop
// @access  Private (Shopkeeper)
router.post(
  '/',
  authenticateToken,
  [
    body('shopName').trim().notEmpty().withMessage('Shop name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is a shopkeeper
      if (req.user.role !== 'shopkeeper') {
        return res.status(403).json({ message: 'Only shopkeepers can create shops' });
      }

      const shop = {
        id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        shopName: req.body.shopName,
        ownerName: req.user.name,
        category: req.body.category,
        address: req.body.address,
        city: req.body.city,
        phone: req.body.phone,
        timings: req.body.timings || '9:00 AM - 9:00 PM',
        description: req.body.description || '',
        logo: req.body.logo || null,
        ownerId: req.user.id,
        rating: null,
        reviewCount: 0,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      shops.push(shop);
      res.status(201).json({ message: 'Shop created successfully', shop });
    } catch (error) {
      console.error('Create shop error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/shops/:id
// @desc    Update shop
// @access  Private (Shop owner)
router.put(
  '/:id',
  authenticateToken,
  [
    body('shopName').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const shopIndex = shops.findIndex(s => s.id === req.params.id);
      if (shopIndex === -1) {
        return res.status(404).json({ message: 'Shop not found' });
      }

      const shop = shops[shopIndex];

      // Check if user owns the shop
      if (shop.ownerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this shop' });
      }

      // Update shop
      Object.assign(shop, req.body, {
        updatedAt: new Date().toISOString(),
      });

      res.json({ message: 'Shop updated successfully', shop });
    } catch (error) {
      console.error('Update shop error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/shops/:id
// @desc    Delete shop
// @access  Private (Shop owner)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const shopIndex = shops.findIndex(s => s.id === req.params.id);
    if (shopIndex === -1) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const shop = shops[shopIndex];

    // Check if user owns the shop
    if (shop.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this shop' });
    }

    shops.splice(shopIndex, 1);
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

