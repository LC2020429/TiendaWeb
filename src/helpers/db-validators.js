import User from "../user/user.model.js";
import CategoryProduct  from "../categoriaProduct/catePro.model.js"

export const emailExists = async (email = "") => {
  const existe = await User.findOne({ email });
  if (existe) {
    throw new Error(`The email ${email} is already registered`);
  }
};

export const usernameExists = async (username = "") => {
  const existe = await User.findOne({ username });
  if (existe) {
    throw new Error(`The username ${username} is already registered`);
  }
};

export const userExists = async (uid = " ") => {
  const existe = await User.findById(uid);
  if (!existe) {
    throw new Error("No existe el usuario con el ID proporcionado");
  }
};

export const categoryExists = async (cpid = " ")=> {
  const existe = await CategoryProduct.findById(cpid);
  if(!existe){
    throw new Error("No existe la categoria con el id dado");
  }
};

export const nameCategory = async (nombreCategoria = "") => {
  const existe = await CategoryProduct.findOne({ nombreCategoria });
  if (existe) {
    throw new Error(`El nombre de esta categoria  ${nombreCategoria} ya esta en el sistema`);
  }
};