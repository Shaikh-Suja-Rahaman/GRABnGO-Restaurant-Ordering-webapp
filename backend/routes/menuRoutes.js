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
/**
 * @openapi
 * /api/menu/{id}:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get a specific menu item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item retrieved successfully
 *       404:
 *         description: Menu item not found
 *   put:
 *     tags:
 *       - Menu
 *     summary: Update a menu item (Admin only)
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
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 *   delete:
 *     tags:
 *       - Menu
 *     summary: Delete a menu item (Admin only)
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
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 */
router.route('/:id')
  .get(getMenuItemById)
  .put(protect, admin, updateMenuItem) // Handles "Update"
  .delete(protect, admin, deleteMenuItem); // Handles "Delete"

export default router;