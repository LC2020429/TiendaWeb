import { Router } from "express";
import { register, login } from "./auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads-pp.js";

const router = Router();

router.post(
  "/register",
  uploadProfilePicture,
  registerValidator,
  register
);

router.post("/login", loginValidator, login);

export default router;
