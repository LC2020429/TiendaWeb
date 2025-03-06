import { Schema, model } from "mongoose";

const ingresoBodega = Schema(
  {
    encargadoIngreso: {
      type: String,
      required: [true, "Debe de dar el nombre del encargado"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Producto", // Referencia al producto
      required: [true, "El id del Producto es obligatorio"],
    },
    cantProducto: {
      type: Number,
      required: [true, "La cantidad del producto es obligatoria"],
      default: 0, // Cantidad que entra a la bodega
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["ACTIVO", "DESCONTINUADO"],
      default: "ACTIVO",
    },
    exisistencia: {
      type: String,
      enum: ["EXISTENCIAS", "AGOTADO"],
      default: "EXISTENCIAS",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

ingresoBodega.methods.toJson = function () {
  const { _id, ...ingresoBo } = this.toObject();
  ingresoBo.bid = _id;
  return ingresoBo;
};

export default model("IngresoBodega", ingresoBodega);
