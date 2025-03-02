import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    apellidos: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      maxLength: [50, "El apellido no puede tener más de 50 caracteres"],
    },
    nombres: {
        type: String,
        required: [true, "Los nombres son obligatorios"],
        maxLength: [50, "Los nombre no pueden exceder los 50 caracteres"],
    },
    userName: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio"],
      maxLength: [50, "El nombre de usuario no puede tener más de 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
    },
    profilePicture: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    role: {
      type: String,
      required: true,
      default: "USER",
      enum: ["ADMIN", "USER"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.toJSON = function () {
  const { password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model("User", userSchema);