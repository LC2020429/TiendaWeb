import { body, param } from "express-validator";
import { categoryExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-admin.js";

export const createCategoryValidator = [
  validateJWT,
  hasRoles("ADMIN"),
  body("nombreCategoria")
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ max: 25 })
    .withMessage("El nombre no puede tener más de 25 caracteres"),
  body("descripcionCategoria")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 75 })
    .withMessage("La descripción no puede tener más de 75 caracteres"),
  validarCampos,
  handleErrors,
];

export const getByIdCategoryValidator = [
  validateJWT,
  param("cpid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  hasRoles("ADMIN"),
  param("cpid").custom(categoryExists),
  validarCampos,
  handleErrors,
];

export const updateCategoryValidator = [
  validateJWT,
  param("cpid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("cpid").custom(categoryExists),
  hasRoles("ADMIN"),
  body("nombreCategoria")
    .optional()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ max: 25 })
    .withMessage("El nombre no puede tener más de 25 caracteres"),
  body("descripcionCategoria")
    .optional()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 75 })
    .withMessage("La descripción no puede tener más de 75 caracteres"),
  validarCampos,
  handleErrors,
];

export const deleteCategoryValidator = [
  validateJWT,
  param("cpid").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("cpid").custom(categoryExists),
  hasRoles("ADMIN"),
  validarCampos,
  handleErrors,
];

export const validateList = [validateJWT];
