import { hash, verify } from "argon2";
import User from "./user.model.js";
import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    return res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { oldPasswordVerify } = req.body; 

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const verifyPassword = await verify(user.password, oldPasswordVerify);
    if (!verifyPassword) {
      return res.status(400).json({
        success: false,
        message: "Contraseña antigua incorrecta",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { status: false },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { role, status, profilePicture, password, email, ...data } = req.body;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No se proporcionaron campos para actualizar",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Usuario actualizado",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error al actualizar usuario",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { uid } = req.params;
    const { oldPasswordVerify, newPassword } = req.body;

    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const verifyPassword = await verify(user.password, oldPasswordVerify);
    if (!verifyPassword) {
      return res.status(400).json({
        success: false,
        message: "Ingrese su contraseña antigua",
      });
    }

    const matchOldAndNewPassword = await verify(user.password, newPassword);
    if (matchOldAndNewPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    const encryptedPassword = await hash(newPassword);
    await User.findByIdAndUpdate(
      uid,
      { password: encryptedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar contraseña",
      error: err.message,
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { uid } = req.params;
    let newProfilePicture = req.file ? req.file.filename : null;

    if (!newProfilePicture) {
      return res.status(400).json({
        success: false,
        msg: "No se proporcionó una nueva foto de perfil",
      });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    if (user.profilePicture) {
      const oldProfilePicturePath = join(
        __dirname,
        "../../public/uploads/profile-pictures",
        user.profilePicture
      );
      await fs.unlink(oldProfilePicturePath);
    }

    user.profilePicture = newProfilePicture;
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Foto de perfil actualizada",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error al actualizar la foto de perfil",
      error: err.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const { newRole, secretKey } = req.body;

    // Verificar que el rol proporcionado sea válido
    if (!["USER", "ADMIN"].includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Rol no válido. Debe ser 'USER' o 'ADMIN'.",
      });
    }

    // Verificar la clave secreta
    if (secretKey !== process.env.SECRETORPRIVATEKEY) {
      return res.status(403).json({
        success: false,
        message: "Clave secreta incorrecta. No autorizado.",
      });
    }

    // Buscar usuario por ID
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    // Si el usuario ya tiene el mismo rol, evitar actualizar
    if (user.role === newRole) {
      return res.status(400).json({
        success: false,
        message: `El usuario ya tiene el rol '${newRole}'.`,
      });
    }

    // Actualizar el rol del usuario
    user.role = newRole;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Rol actualizado correctamente a '${newRole}'.`,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el rol del usuario.",
      error: err.message,
    });
  }
};
