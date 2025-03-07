import express from "express";
import {
  agregarCarrito,
  listarCarritosActivosPorUsuario,
  listarTodosCarritosPorUsuario,
  editarCarrito,
  cancelarCarrito, 
} from "./carrito.controller.js";
import {
  agregarCarritoValidator,
  editarCarritoValidator,
  listarCarritosValidator,
  listarTodosCarritosValidator,
  cancelarCarritoValidator,
} from "../middlewares/carrito-validator.js";

const router = express.Router();

router.post(
  "/agregarCarrito/:usuarioId",
  agregarCarritoValidator,
  agregarCarrito
);
router.get(
  "/carritosUserActivos/:usuarioId",
  listarCarritosValidator,
  listarCarritosActivosPorUsuario
);
router.get(
  "/listCarrtiosUser/:usuarioId",
  listarTodosCarritosValidator,
  listarTodosCarritosPorUsuario
);
router.put(
  "/updateCarrito/:usuarioId/:carritoId",
  editarCarritoValidator,
  editarCarrito
);

router.put(
  "/cancelarCarrito/:carritoId",
  cancelarCarritoValidator,
  cancelarCarrito
);

export default router;
