import { Router } from "express"
import { uploadProfilePicture } from "../middlewares/multerUploads.js"
import { getUserById, getUsers, deleteUser, updatePassword, updateUser } from "./user.controller.js"
import {validateJWT, isAdminRole} from "../middlewares/validate-jwt.js"
import { getUserByIdValidator, deleteUserValidator, updatePasswordValidator, updateUserValidator } from "../middlewares/user-validators.js"

const router = Router()

router.get("/findUser/:uid", getUserByIdValidator, getUserById)

router.get("/", getUsers)

router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser, validateJWT, isAdminRole)

router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword)

router.put("/updateUser/:uid", updateUserValidator, uploadProfilePicture.single("profilePicture"), updateUser)

export default router
    