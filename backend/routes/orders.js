import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory order storage (replace with database)
let orders = [];

// @route   GET /api/orders
// @desc    Get orders (filtered by user role)
// @access  Private
router.get('/', authenticateToken, (req, res) => {
  let filteredOrders = [];

  if (req.user.role === 'shopkeeper') {
    // Shopkeepers see orders for their shops
    filteredOrders = orders.filter(o => o.shopId === req.user.shopId);
  } else {
    // Customers see their own orders
    filteredOrders = orders.filter(o => o.customerId === req.user.id);
  }

  res.json({ orders: filteredOrders });
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Check authorization
  if (req.user.role === 'customer' && order.customerId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (req.user.role === 'shopkeeper' && order.shopId !== req.user.shopId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json({ order });
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Customer)
router.post(
  '/',
  authenticateToken,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().normalizeEmail(),
    body('customerPhone').trim().notEmpty().withMessage('Phone is required'),
    body('customerAddress').trim().notEmpty().withMessage('Address is required'),
    body('customerCity').trim().notEmpty().withMessage('City is required'),
    body('customerPincode').trim().notEmpty().withMessage('Pincode is required'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is a customer
      if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Only customers can create orders' });
      }

      // Calculate total
      const total = req.body.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerId: req.user.id,
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        customerPhone: req.body.customerPhone,
        customerAddress: req.body.customerAddress,
        customerCity: req.body.customerCity,
        customerPincode: req.body.customerPincode,
        shopId: req.body.shopId,
        shopName: req.body.shopName,
        items: req.body.items,
        total,
        status: 'pending',
        paymentMethod: req.body.paymentMethod || 'cod',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      orders.push(order);
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Shopkeeper)
router.put(
  '/:id/status',
  authenticateToken,
  [
    body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (req.user.role !== 'shopkeeper') {
        return res.status(403).json({ message: 'Only shopkeepers can update order status' });
      }

      const orderIndex = orders.findIndex(o => o.id === req.params.id);
      if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const order = orders[orderIndex];

      // Check if order belongs to shopkeeper's shop
      if (order.shopId !== req.user.shopId) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }

      order.status = req.body.status;
      order.updatedAt = new Date().toISOString();

      res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;

