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

router.post("/bodegaAdd", guardarIngresoBodegaValidator, guardarIngresoBodega);

router.put(
  "/bodegaEdit/:bid",
  updateIngresoBodegaValidator,
  updateIngresoBodega
);

router.get("/listBodega", listarIngresosBodegaValidator, listarIngresosBodega);

router.delete(
  "/deleteProduct/:bid",
  listarIngresosBodegaValidator,
  descontinuarBodegaProducto
);

router.get(
  "/listporId/:bid",
  listarIngresosBodegaValidator,
  buscarIngresoBodegaPorId
);

export default router;
