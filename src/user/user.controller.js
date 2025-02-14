import { json } from "express";
import User from "./user.model.js";

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        succes: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      succes: true,
      user,
    });
  } catch (err) {
    return (
      res.status(404),
      json({
        succes: false,
        message: "Error finding user",
        error: err.messagem,
      })
    );
  }
};

export const getUsers = async (req, res) => {
  try {
    const { limite = 10, desde = 0 } = req.query;
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
      message: "Error finding users",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findByIdAndUpdate(
      uid,
      { status: false },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { uid } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(uid);

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

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    let data = req.body;

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    // para eliminar la imagen
    if (req.file) {
      const imagePath = `/uploads/profile-picctures/${req.file.filename}`;
      data.profilePicture = imagePath;
    } else {
      data.profilePicture = user.profilePicture;
    }
    const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: err.message,
    });
  }
};
