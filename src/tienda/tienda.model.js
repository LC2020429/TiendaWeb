import { Schema } from "mongoose";
const tiendaSchema = Schema(
  {
    nombreTienda: {
      type: String,
      required: [true, "La tienda debe de tener un nombre"],
    },
    horario: {
      type: String,
      required: [true, "Se debe de colocar un horario de atencion"],
    },
    nitTienda: {
      type: String,
      required: [true, "Toda tienda por ley tiene un nit"],
    },
    ingresoBodega: [
      {
        type: Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

tiendaSchema.methods.toJson = function (){
    const { _id, ...tiendda} = this.toObject();
    product.tid = _id;
    return tienda;
};

export default module("Tienda", tiendaSchema);