import { body, param } from "express-validator";
import { productExists, bodegaCantidad } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-admin.js";

export const guardarIngresoBodegaValidator = [
  validateJWT,
  hasRoles("ADMIN"),
  body("encargadoIngreso")
    .notEmpty()
    .withMessage("El encargado de la bodega es obligatorio"),
  body("productos")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un producto en la lista"),
  body("productos.*.id")
    .notEmpty()
    .withMessage("Cada producto debe tener un ID válido")
    .custom(productExists),
  body("productos.*.cantProducto")
    .notEmpty()
    .withMessage("Cada producto debe tener una cantidad asignada")
    .isInt({ min: 1 })
    .withMessage(
      "La cantidad del producto debe ser un número entero mayor que 0"
    )
    .toInt()
    .custom(bodegaCantidad),

  validarCampos,
  handleErrors,
];

export const updateIngresoBodegaValidator = [
  validateJWT,
  hasRoles("ADMIN"),
  param("bid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  body("productos")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un producto en la lista"),
  body("productos.*.id")
    .optional()
    .notEmpty()
    .withMessage("Cada producto debe tener un ID válido")
    .custom(productExists),
  body("productos.*.cantProducto")
    .optional()
    .notEmpty()
    .withMessage("Cada producto debe tener una cantidad asignada")
    .custom(bodegaCantidad),

  validarCampos,
  handleErrors,
];

export const descontinuarProductoValidator = [
  validateJWT,
  hasRoles("ADMIN"),
  param("bid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("pid")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB para el producto")
    .custom(productExists),
  validarCampos,
  handleErrors,
];

export const listarIngresosBodegaValidator = [
  validateJWT,
  hasRoles("ADMIN"),
  handleErrors,
];
