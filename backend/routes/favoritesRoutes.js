import { addFavorite, removeFavorite, getFavorites } from "../controllers/favoritesController.js";
import { protect } from "../middleware/authMiddleware.js";

import express from 'express'

const router = express.Router()
router.use(protect);

/**
 * @openapi
 * /api/favorites:
 *   get:
 *     tags:
 *       - Favorites
 *     summary: Get all favorites for logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorites
 *   post:
 *     tags:
 *       - Favorites
 *     summary: Add an item to favorites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menuItemId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to favorites
 */
router.route('/').get(getFavorites).post(addFavorite)

/**
 * @openapi
 * /api/favorites/{id}:
 *   delete:
 *     tags:
 *       - Favorites
 *     summary: Remove an item from favorites
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
 *         description: Removed from favorites
 */
router.route('/:id').delete(removeFavorite);
// Remove a favorite (sends ID in URL)

export default router;