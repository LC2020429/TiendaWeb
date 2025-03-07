import { Router } from "express";
import {
  guardarIngresoBodega,
  updateIngresoBodega,
  listarIngresosBodega,
  descontinuarBodegaProducto,
  buscarIngresoBodegaPorId,
} from "./ingresoB.controller.js";
import {
  guardarIngresoBodegaValidator,
  updateIngresoBodegaValidator,
  listarIngresosBodegaValidator,
  descontinuarProductoValidator,
} from "../middlewares/bodega-validator.js";

const router = Router();

/**
 * @swagger
 * /bodegaAdd:
 *   post:
 *     summary: Add a new ingreso bodega
 *     responses:
 *       201:
 *         description: Ingreso bodega added
 */
router.post("/bodegaAdd", guardarIngresoBodegaValidator, guardarIngresoBodega);

/**
 * @swagger
 * /bodegaEdit/{bid}:
 *   put:
 *     summary: Update ingreso bodega information
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: Ingreso bodega ID
 *     responses:
 *       200:
 *         description: Ingreso bodega updated
 *       404:
 *         description: Ingreso bodega not found
 */
router.put(
  "/bodegaEdit/:bid",
  updateIngresoBodegaValidator,
  updateIngresoBodega
);

/**
 * @swagger
 * /listBodega:
 *   get:
 *     summary: Get list of ingresos bodega
 *     responses:
 *       200:
 *         description: List of ingresos bodega
 */
router.get("/listBodega", listarIngresosBodegaValidator, listarIngresosBodega);

/**
 * @swagger
 * /deleteProduct/{bid}:
 *   delete:
 *     summary: Discontinue product in bodega
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: Ingreso bodega ID
 *     responses:
 *       200:
 *         description: Product discontinued
 *       404:
 *         description: Ingreso bodega not found
 */
router.delete(
  "/deleteProduct/:bid",
  listarIngresosBodegaValidator,
  descontinuarBodegaProducto
);

/**
 * @swagger
 * /listporId/{bid}:
 *   get:
 *     summary: Get ingreso bodega by ID
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: Ingreso bodega ID
 *     responses:
 *       200:
 *         description: Ingreso bodega found
 *       404:
 *         description: Ingreso bodega not found
 */
router.get(
  "/listporId/:bid",
  listarIngresosBodegaValidator,
  buscarIngresoBodegaPorId
);

export default router;
