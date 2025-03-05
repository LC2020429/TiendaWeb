import { body, param } from "express-validator";
import { categoryExists } from "../helpers/db-validators.js";
import {
  categoryIsActive,
  nameCategory,
  productExists,
  productNameExists,
} from "../helpers/status-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-admin.js";

export const createProductValidator = [
  validateJWT,
  hasRoles("ADMIN"),
  body("nombreProducto")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ max: 25 })
    .withMessage("El nombre no puede tener más de 25 caracteres")
    .custom(productNameExists), // Validación de nombre de producto existente
  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isNumeric()
    .withMessage("El precio debe ser un número"),
  body("descripcionEspecificaP")
    .optional()
    .isLength({ max: 150 })
    .withMessage("La descripción no puede exceder los 150 caracteres"),
  body("categoriaProducto")
    .notEmpty()
    .withMessage("La categoría del producto es obligatoria")
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB")
    .custom(categoryExists)
    .custom(categoryIsActive), // Verifica que la categoría esté activa
  validarCampos,
  handleErrors,
];

export const getProductByIdValidator = [
  validateJWT,
  param("pid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  validarCampos,
  handleErrors,
];

export const listProductsValidator = [validateJWT, validarCampos, handleErrors];

export const updateProductValidator = [
  validateJWT,
  param("pid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  hasRoles("ADMIN"),
  body("nombreProducto")
    .optional()
    .notEmpty()
    .withMessage("El nombre del producto no puede estar vacío")
    .isLength({ max: 25 })
    .withMessage("El nombre no puede tener más de 25 caracteres"),
  body("precio")
    .optional()
    .isNumeric()
    .withMessage("El precio debe ser un número"),
  body("descripcionEspecificaP")
    .optional()
    .isLength({ max: 150 })
    .withMessage("La descripción no puede exceder los 150 caracteres"),
  body("categoriaProducto")
    .optional()
    .isMongoId()
    .withMessage("No es un ID válido de MongoDB")
    .custom(categoryExists)
    .custom(categoryIsActive), // Verifica que la categoría esté activa al actualizar
  validarCampos,
  handleErrors,
];

export const deleteProductValidator = [
  validateJWT,
  param("pid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  hasRoles("ADMIN"),
  validarCampos,
  handleErrors,
];