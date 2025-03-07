import { Schema, model } from "mongoose";

const carritoSchema = Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El carrito debe pertenecer a un usuario"],
    },
    productos: [
      {
        producto: {
          type: Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          default: 1,
        },
        precio: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    estado: {
      type: String,
      enum: ["ACTIVO", "CANCEL", "DELETED"],
      default: "ACTIVO",
    },
    status: {
      type: Boolean,
      default: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    facturado: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

carritoSchema.methods.calcularTotal = function () {
  let total = 0;
  this.productos.forEach((producto) => {
    total += producto.cantidad * producto.precio;
  });
  this.total = total;
  return this.total;
};

carritoSchema.methods.toJson = function () {
  const { _id, ...carrito } = this.toObject();
  carrito.caid = _id;
  return carrito;
};

export default model("Carrito", carritoSchema);
