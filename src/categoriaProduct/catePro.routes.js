import { Router } from "express";
import {
  findCategory,
  listCategories,
  deleteCategory,
  saveCategory,
  updateCategory,
} from "./catePro.controller.js";
import {
  createCategoryValidator,
  getByIdCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  validateList,
} from "../middlewares/catePro-validators.js";

const router = Router();

/**
 * @swagger
 * /agregarCategoria:
 *   post:
 *     summary: Add a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/agregarCategoria", createCategoryValidator, saveCategory);

/**
 * @swagger
 * /buscarCategoria/{cpid}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: cpid
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get("/buscarCategoria/:cpid", getByIdCategoryValidator, findCategory);

/**
 * @swagger
 * /:
 *   get:
 *     summary: List all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get("/", validateList, listCategories);

/**
 * @swagger
 * /actualizarCategoria/{cpid}:
 *   patch:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: cpid
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 */
router.patch(
  "/actualizarCategoria/:cpid",
  updateCategoryValidator,
  updateCategory
);

/**
 * @swagger
 * /eliminarCategoria/{cpid}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: cpid
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete(
  "/eliminarCategoria/:cpid",
  deleteCategoryValidator,
  deleteCategory
);

export default router;
