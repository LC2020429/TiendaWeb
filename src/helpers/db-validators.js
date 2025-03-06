import User from "../user/user.model.js";
import CategoryProduct from "../categoriaProduct/catePro.model.js";
import Product from "../product/product.model.js";

export const emailExists = async (email = "") => {
  const existe = await User.findOne({ email });
  if (existe) {
    throw new Error(`El email ${email} ya está registrado`);
  }
};

export const usernameExists = async (username = "") => {
  const existe = await User.findOne({ username });
  if (existe) {
    throw new Error(`El nombre de usuario ${username} ya está registrado`);
  }
};

export const userExists = async (uid = "") => {
  if (!uid) {
    throw new Error("El ID del usuario no puede estar vacío");
  }
  const existe = await User.findById(uid);
  if (!existe) {
    throw new Error(`No existe el usuario con el ID ${uid}`);
  }
};

export const categoryExists = async (cpid = "") => {
  if (!cpid) {
    throw new Error("El ID de la categoría no puede estar vacío");
  }
  const existe = await CategoryProduct.findById(cpid);
  if (!existe) {
    throw new Error(`No existe la categoría con el ID ${cpid}`);
  }
};

export const nameCategory = async (nombreCategoria = "") => {
  const nombreTrimmed = nombreCategoria.trim().toLowerCase(); // Usamos toLowerCase() para una comparación uniforme
  const existe = await CategoryProduct.findOne({
    nombreCategoria: nombreTrimmed,
  });
  if (existe) {
    throw new Error(
      `El nombre de esta categoría '${nombreCategoria}' ya está en el sistema`
    );
  }
};

export const productExists = async (pid = "") => {
  if (!pid) {
    throw new Error("El ID del producto no puede estar vacío");
  }
  const product = await Product.findById(pid);
  if (!product) {
    throw new Error(`No existe el producto con el ID ${pid}`);
  }
};

export const productNameExists = async (nombreProducto = "") => {
  const nombreLowerCase = nombreProducto.trim().toLowerCase();
  const existe = await Product.findOne({ nombreProducto: nombreLowerCase });
  if (existe) {
    throw new Error(`El producto '${nombreProducto}' ya existe.`);
  }
};
export const bodegaCantidad = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("La cantidad del producto debe ser un número válido");
  }
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      "La cantidad del producto debe ser un número entero mayor o igual a 0"
    );
  }
  return true;
};
