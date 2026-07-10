import express from 'express';

// 1. Import ALL your controller functions
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
} from '../controllers/menuController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for /api/menu
/**
 * @openapi
 * /api/menu:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Retrieve all menu items
 *     responses:
 *       200:
 *         description: A list of menu items.
 *   post:
 *     tags:
 *       - Menu
 *     summary: Create a new menu item
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
 *         description: Created
 */
router.route('/')
  .get(getMenuItems)
  .post(protect, admin, createMenuItem);

// 2. ADD THIS ENTIRE BLOCK
// This tells Express what to do for routes like /api/menu/12345
router.route('/:id')
  .get(getMenuItemById)
  .put(protect, admin, updateMenuItem) // Handles "Update"
  .delete(protect, admin, deleteMenuItem); // Handles "Delete"

export default router;