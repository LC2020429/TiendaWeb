import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const validateJWT = async (req, res, next) => {
  try {
    let token =
      req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No existe token en la petición",
      });
    }

    token = token.replace(/^Bearer\s+/, "");

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "usaurio no existe en la DB",
      });
    }

    // Valida que el sea el dueño del token
    if (req.params.uid && req.params.uid !== uid) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para realizar esta acción",
      });
    }

    req.usuario = user;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al validar el token",
      error: err.message,
    });
  }
};
