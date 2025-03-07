import { body, param } from "express-validator";
import { productExists, bodegaCantidad } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { validateOwn } from "./validate-own.js";
import { hasRoles } from "./validate-admin.js";

export const agregarCarritoValidator = [
  validateJWT,
  hasRoles("USER"),
  validateOwn,
  body("productos")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un producto en el carrito"),
  body("productos.*.productoId")
    .notEmpty()
    .withMessage("Cada producto debe tener un ID válido")
    .custom(productExists),
  body("productos.*.cantidad")
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

export const editarCarritoValidator = [
  validateJWT,
  validateOwn,
  param("carritoId")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB para el carrito"),
  body("productos")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un producto en el carrito"),
  body("productos.*.productoId")
    .optional()
    .notEmpty()
    .withMessage("Cada producto debe tener un ID válido")
    .custom(productExists),
  body("productos.*.cantidad")
    .optional()
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

export const listarCarritosValidator = [
  validateJWT,
  validateOwn,
  param("usuarioId")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB para el usuario"),
  validarCampos,
  handleErrors,
];

export const listarTodosCarritosValidator = [
  validateJWT,
  validateOwn,
  param("usuarioId")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB para el usuario"),
  validarCampos,
  handleErrors,
];

export const cancelarCarritoValidator = [
  validateJWT,
  validateOwn,
  param("carritoId")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB para el carrito"),
  validarCampos,
  handleErrors,
];
