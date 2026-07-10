import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @openapi
 * /api/payments/create-order:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a Razorpay order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Razorpay order created successfully
 */
router.post("/create-order", protect, createRazorpayOrder);
/**
 * @openapi
 * /api/payments/verify:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Verify a Razorpay payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment verification failed
 */
router.post("/verify", protect, verifyRazorpayPayment);

export default router;