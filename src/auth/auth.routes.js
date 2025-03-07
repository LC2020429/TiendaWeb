import { Router } from "express";
import { register, login } from "./auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads-pp.js";

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/register",
  uploadProfilePicture,
  registerValidator,
  register
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginValidator, login);

export default router;
