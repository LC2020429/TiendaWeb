import { Schema, model } from "mongoose";

const ingresoBodega = Schema(
  {
    encargadoBodega: {
      type: String,
      required: [true, "Debe de dar el nombre de"],
    },
    cantProducto: {
      type: Number,
      default: 0,
    },
    schemaProduct: [
      {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: [true, "El id del Producto es obligatoria"],
      },
    ],
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

ingresoBodega.methods.toJson = function () {
  const { _id, ...ingresoBo } = this.toObject();
  ingresoBo.bid = _id;
  return ingresoBo;
};
export default model("Stock", ingresoBodega);
