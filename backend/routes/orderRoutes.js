import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for creating an order
// We use 'protect' because *any* logged-in user can place an order
/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Place a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Order placed successfully
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.route('/')
  .post(protect, placeOrder)         // Customer: Place an order
.get(protect, admin, getAllOrders); // Admin: Get all orders

// --- Customer-specific routes ---
// '/myorders' MUST come before '/:id'
/**
 * @openapi
 * /api/orders/myorders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get logged in user's orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
router.route('/myorders')
  .get(protect, getMyOrders);       // Customer: Get their own orders

// --- Routes for a specific order ID ---
/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.route('/:id')
  .get(protect, getOrderById);      // Customer OR Admin: Get one order

// --- Admin-specific routes ---
/**
 * @openapi
 * /api/orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.route('/:id/status')
  .put(protect, admin, updateOrderStatus); // Admin: Update order status

export default router;
