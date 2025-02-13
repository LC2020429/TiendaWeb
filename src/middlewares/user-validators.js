import { body, param } from "express-validator";
import {
  correoExist,
  userExists,
  usernameExists,
} from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handel-errors.js";

export const registerValidatorAdmin = [
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("Username is required"),
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("email").custom(correoExist),
  body("username").custom(usernameExists),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least 8 characters, 1 uppercase, and 1 special character"
    ),
  validarCampos,
  deleteFileOnError,
  handleErrors,
];

export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("Username is required"),
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Is not a valid email"),
  body("email").custom(correoExist),
  body("role").default("Estudiante"),
  body("username").custom(usernameExists),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least 8 characters, 1 uppercase, and 1 special character"
    ),
  (req, res, next) => {
    // Elimina el campo role si existe en la solicitud para poner por defecto el valor de user
    if (req.body.role) {
      delete req.body.role;
    }
    req.body.role = "user";
    next();
  },
  validarCampos,
  deleteFileOnError,
  handleErrors,
];

export const loginValidator = [
  body("email").optional().isEmail().withMessage("Is not a valid email"), 
  body("name")
    .optional()
    .isString()
    .withMessage("Wrong name format"),
  validarCampos,
  handleErrors,
];

export const getUserByIdValidator = [
  param("uid").isMongoId().withMessage("Invalid MongoDB ID"),
  param("uid").custom(userExists),
  validarCampos,
  handleErrors,
];

export const deleteUserValidator = [
  param("uid").isMongoId().withMessage("Invalid MongoDB ID"),
  param("uid").custom(userExists),
  validarCampos,
  handleErrors,
];

export const updatePasswordValidator = [
  param("uid").isMongoId().withMessage("Invalid MongoDB ID"),
  param("uid").custom(userExists),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validarCampos,
  handleErrors,
];

export const updateUserValidator = [
  param("uid", "Invalid ID").isMongoId(),
  param("uid").custom(userExists),
  validarCampos,
  handleErrors,
];
