import User from "../user/user.model.js";

export const emailExist = async (email = "") => {
  const existe = await User.findOne({ email });
  if (existe) {
    throw new Error(`email ${email} is already registered`);
  }
};
export const userExists = async (uid = " ") => {
  const existe = await User.findById(uid);
  if (!existe) {
    throw new Error("User not found with this ID ");
  }
};

export const usernameExists = async (username = "") => {
  const existe = await User.findOne({ username });
  if (existe) {
    throw new Error(`The username ${username} is already registered`);
  }
};
