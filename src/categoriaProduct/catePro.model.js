import { Schema, model } from "mongoose";

const categoriaProduct = Schema(
  {
    nombreCategoria: {
      type: String,
      required: [true, "La categoria es obligatoria"],
      maxLength: [25, "La categoria no puede ser mayor a 25 caracteres"],
      unique: true,
    },
    descripcionCategoria: {
        type: String,
        required: [true, "La descripcion es oblicagotoria"],
        maxLength: [75, "La descripcion no puede exceder los 75 caracteres"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

categoriaProduct.methods.toJson = function () {
  const { _id, ...category } = this.toObject();
  category.cpid = _id;
  return category;
};

export default model("CategoryProduct", categoriaProduct);
