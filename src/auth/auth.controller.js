import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
  try {
    const data = req.body;
    data.password = await hash(data.password);

    const user = await User.create(data);

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      uid: user.id,
      userName: user.userName,
      email: user.email,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error en el registro de usuario",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, userName, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (!user || !user.status) {
      return res.status(400).json({
        message: "Credenciales inválidas",
        error: "No existe el usuario o ha sido deshabilitado",
      });
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Credenciales inválidas",
        error: "Contraseña incorrecta",
      });
    }

    const token = await generateJWT(user.id);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      userDetails: {
        uid: user.id,
        token,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error en el inicio de sesión",
      error: err.message,
    });
  }
};