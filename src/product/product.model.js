import { Schema, model } from "mongoose";

const schemaProduct = Schema(
  {
    nombreProducto: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      maxLength: [25, "El nombre no puede ser mayor a 25 caracteres"],
    },
    precio: {
      type: Number,
      required: true,
      default: 0,
    },
    productFoto: {
      type: String,
    },
    descripcionEspecificaP: {
      type: String,
      maxLength: [150, "La descripcion no puede exceder los 150 caracteres"],
    },
    categoriaProducto: {
      type: Schema.Types.ObjectId,
      ref: "CategoryProduct",
      required: [true, "El id de la categoría es obligatoria"],
    },
    ventas:{
      type: Number,
      default: 0,
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

schemaProduct.methods.toJson = function () {
  const { _id, ...product } = this.toObject();
  product.pid = _id;
  return product;
};
export default model("Producto", schemaProduct);
