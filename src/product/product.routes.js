import { Router } from "express";
import {
  guardarProduct,
  buscarProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto,
  listarProductosDeleted,
  listarProductosMostSell,
  listarProductosPorCategoria,
} from "./product.controller.js";

import {
  createProductValidator,
  getProductByIdValidator,
  listProductsValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../middlewares/product-validator.js";

import { uploadProductImages } from "../middlewares/multer-uploads-pp.js";

const router = Router();

/**
 * @swagger
 * /agregarProduct:
 *   post:
 *     summary: Add a new product
 *     responses:
 *       201:
 *         description: Product added
 */
router.post(
  "/agregarProduct",
  uploadProductImages,
  createProductValidator,
  guardarProduct
);

/**
 * @swagger
 * /buscarProduct/{pid}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/buscarProduct/:pid", getProductByIdValidator, buscarProducto);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get list of products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", listProductsValidator, listarProductos);

/**
 * @swagger
 * /listDelete:
 *   get:
 *     summary: Get list of deleted products
 *     responses:
 *       200:
 *         description: List of deleted products
 */
router.get("/listDelete", listProductsValidator, listarProductosDeleted);

/**
 * @swagger
 * /listMostSelled:
 *   get:
 *     summary: Get list of most sold products
 *     responses:
 *       200:
 *         description: List of most sold products
 */
router.get("/listMostSelled", listProductsValidator, listarProductosMostSell);

/**
 * @swagger
 * /productByNameCategoria/{categoriaNombre}:
 *   get:
 *     summary: Get products by category name
 *     parameters:
 *       - in: path
 *         name: categoriaNombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: List of products by category
 */
router.get("/productByNameCategoria/:categoriaNombre", listProductsValidator, listarProductosPorCategoria);

/**
 * @swagger
 * /actualizarProduct/{pid}:
 *   patch:
 *     summary: Update product information
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch(
  "/actualizarProduct/:pid",
  updateProductValidator,
  actualizarProducto
);

/**
 * @swagger
 * /eliminarProducto/{pid}:
 *   delete:
 *     summary: Delete product by ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete(
  "/eliminarProducto/:pid",
  deleteProductValidator,
  eliminarProducto
);

export default router;
