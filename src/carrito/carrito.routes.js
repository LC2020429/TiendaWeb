import express from "express";
import {
  agregarCarrito,
  listarCarritosActivosPorUsuario,
  listarTodosCarritosPorUsuario,
  editarCarrito,
  cancelarCarrito,
} from "./carrito.controller.js";
import { validateOwn } from "../middlewares/validate-own.js";
import { generarFactura } from "../middlewares/factura-upload.js";
import {
  agregarCarritoValidator,
  editarCarritoValidator,
  listarCarritosValidator,
  listarTodosCarritosValidator,
  cancelarCarritoValidator,
} from "../middlewares/carrito-validator.js";

const router = express.Router();

/**
 * @swagger
 * /agregarCarrito/{usuarioId}:
 *   post:
 *     summary: Add a new cart for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart added successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/agregarCarrito/:uid",
  agregarCarritoValidator,
  agregarCarrito
);

/**
 * @swagger
 * /carritosUserActivos/{usuarioId}:
 *   get:
 *     summary: List active carts for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of active carts
 *       404:
 *         description: User not found
 */
router.get(
  "/carritosUserActivos/:uid",
  validateOwn,
  listarCarritosValidator,
  listarCarritosActivosPorUsuario
);

/**
 * @swagger
 * /listCarrtiosUser/{usuarioId}:
 *   get:
 *     summary: List all carts for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of all carts
 *       404:
 *         description: User not found
 */
router.get(
  "/listCarrtiosUser/:uid",
  validateOwn,
  listarTodosCarritosValidator,
  listarTodosCarritosPorUsuario
);

/**
 * @swagger
 * /updateCarrito/{usuarioId}/{carritoId}:
 *   put:
 *     summary: Update a cart by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: carritoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Cart not found
 */
router.put(
  "/updateCarrito/:uid/:carritoId",
  validateOwn,
  editarCarritoValidator,
  editarCarrito
);

/**
 * @swagger
 * /cancelarCarrito/{carritoId}:
 *   delete:
 *     summary: Cancel a cart by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: carritoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart cancelled successfully
 *       404:
 *         description: Cart not found
 */
router.delete(
  "/cancelarCarrito/:carritoId",
  validateOwn,
  cancelarCarritoValidator,
  cancelarCarrito
);

/**
 * @swagger
 * /factura/{carritoId}:
 *   post:
 *     summary: Generate an invoice for a cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: carritoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Invoice generated successfully
 *       404:
 *         description: Cart not found
 */
router.post("/factura/:carritoId", generarFactura); 

export default router;
