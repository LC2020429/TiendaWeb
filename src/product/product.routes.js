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

router.post(
  "/agregarProduct",
  uploadProductImages,
  createProductValidator,
  guardarProduct
);

router.get("/buscarProduct/:pid", getProductByIdValidator, buscarProducto);

router.get("/", listProductsValidator, listarProductos);

router.get("/listDelete", listProductsValidator, listarProductosDeleted);

router.get("/listMostSelled", listProductsValidator, listarProductosMostSell);

router.get("/productByNameCategoria/:categoriaNombre", listProductsValidator, listarProductosPorCategoria);

router.patch(
  "/actualizarProduct/:pid",
  updateProductValidator,
  actualizarProducto
);

router.delete(
  "/eliminarProducto/:pid",
  deleteProductValidator,
  eliminarProducto
);

export default router;
