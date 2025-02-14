import { Router } from "express";
import { register, login } from "./auth.controller.js";
import {
  registerValidator,
  loginValidator,
  registerValidatorAdmin,
} from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multerUploads.js";

const router = Router();

router.post(
  "/registe-admin",
  uploadProfilePicture.single("profilePicture"),
  registerValidatorAdmin,
  register
);

router.post(
  "/regist",
  uploadProfilePicture.single("profilePicture"),
  registerValidator,
  register
);

router.post("/login", loginValidator, login);

export default router;
