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

/**
 * @swagger
 * /findUser/{uid}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/findUser/:uid", getUserByIdValidator, getUserById);

/**
 * @swagger
 * /findUsers:
 *   get:
 *     summary: Get list of users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/findUsers", listUsersValidators, getUsers);

/**
 * @swagger
 * /deleteUser/{uid}:
 *   delete:
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser);

/**
 * @swagger
 * /updatePassword/{uid}:
 *   patch:
 *     summary: Update user password
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Password updated
 *       404:
 *         description: User not found
 */
router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword);

/**
 * @swagger
 * /updateUser/{uid}:
 *   put:
 *     summary: Update user information
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put("/updateUser/:uid", updateUserValidator, updateUser);

/**
 * @swagger
 * /updateProfilePicture/{uid}:
 *   patch:
 *     summary: Update user profile picture
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile picture updated
 *       404:
 *         description: User not found
 */
router.patch(
  "/updateProfilePicture/:uid",
  uploadProfilePicture,
  updateProfilePictureValidator,
  updateProfilePicture
);

/**
 * @swagger
 * /updateRole/{uid}:
 *   patch:
 *     summary: Update user role
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User role updated
 *       404:
 *         description: User not found
 */
router.patch("/updateRole/:uid", updateUserRoleValidator, updateUserRole);

export default router;
