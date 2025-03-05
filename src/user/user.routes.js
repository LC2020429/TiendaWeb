import { Router } from "express";
import {
  getUserById,
  getUsers,
  deleteUser,
  updatePassword,
  updateUser,
  updateProfilePicture,
  updateUserRole,
} from "./user.controller.js";
import {
  getUserByIdValidator,
  deleteUserValidator,
  updatePasswordValidator,
  updateUserValidator,
  updateProfilePictureValidator,
  listUsersValidators,
  updateUserRoleValidator, 
} from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads-pp.js";

const router = Router();

router.get("/findUser/:uid", getUserByIdValidator, getUserById);

router.get("/findUsers", listUsersValidators, getUsers);

router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser);

router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword);

router.put("/updateUser/:uid", updateUserValidator, updateUser);

router.patch(
  "/updateProfilePicture/:uid",
  uploadProfilePicture,
  updateProfilePictureValidator,
  updateProfilePicture
);

router.patch("/updateRole/:uid", updateUserRoleValidator, updateUserRole);
export default router;
