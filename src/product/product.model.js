import { Schema, model } from "mongoose";

const schemaProduct = Schema(
  {
    nombreProducto: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      maxLength: [25, "El nombre no puede ser mayor a 25 caracteres"],
    },
    moneda: {
      type: String,
      required: true,
      default: "Q",
      enum: ["$", "Q"],
    },
    precio: {
      type: Number,
      required: true,
      default: 0,
    },
    productFoto: {
      type: String,
    },
    tipoProduct: {
      type: String,
      required: [
        true,
        "Se debe de dar el estado del producto, New, Lujo, etc.",
      ],
      maxLength: [
        20,
        "El tipo de producto no pueden exceder los 20 caracteres",
      ],
    },
    color: {
      type: String,
      maxLength: [16, "Los colores no pueden exceder los 16 caracteres"],
    },
    size: {
      type: String,
      maxLength: [20, "Los colores no pueden exceder los 20 caracteres"],
    },
    categoriaProducto: {
      type: Schema.Types.ObjectId,
      ref: "categoriaProduct",
      required: [true, "El id de la categoría es obligatoria"],
    },
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

schemaProduct.methods.toJson = function () {
  const { _id, ...product } = this.toObject();
  product.pid = _id;
  return product;
};
export default model("Producto", schemaProduct);
