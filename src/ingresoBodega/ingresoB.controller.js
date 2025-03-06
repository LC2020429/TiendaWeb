import IngresoBodega from "./ingresoB.model.js";
import Producto from "../product/product.model.js";

export const guardarIngresoBodega = async (req, res) => {
  try {
    console.log("Cuerpo recibido:", req.body);

    const { encargadoIngreso, productos } = req.body;
    const ingresosBodega = productos.map((producto) => ({
      encargadoIngreso,
      product: producto.id,
      cantProducto: producto.cantProducto,
      total: producto.total,
    }));

    const result = await IngresoBodega.insertMany(ingresosBodega);

    return res.status(201).json({
      success: true,
      message: "Ingreso de bodega realizado con éxito",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al guardar el ingreso de bodega",
      error: error.message,
    });
  }
};

export const updateIngresoBodega = async (req, res) => {
  try {
    const { bid } = req.params;
    const { encargadoIngreso, productos } = req.body;

    const ingresoExistente = await IngresoBodega.findById(bid);

    if (!ingresoExistente) {
      return res.status(404).json({
        success: false,
        message: "Ingreso de bodega no encontrado",
      });
    }

    if (encargadoIngreso) {
      ingresoExistente.encargadoIngreso = encargadoIngreso;
    }
    await ingresoExistente.save();

    return res.status(200).json({
      success: true,
      message: "Ingreso de bodega actualizado correctamente",
      ingreso: ingresoExistente,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el ingreso de bodega",
      error: err.message,
    });
  }
};

export const listarIngresosBodega = async (req, res) => {
  try {
    const ingresos = await IngresoBodega.find()
      .populate("product")
      .select("product cantProducto total encargadoIngreso");

    const productosEnBodega = ingresos.map((ingreso) => ({
      encargado: ingreso.encargadoIngreso,
      productos: ingreso.product,
      cantidades: ingreso.cantProducto,
      total: ingreso.total,
    }));

    return res.status(200).json({
      success: true,
      productosEnBodega,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al listar los productos en bodega",
      error: err.message,
    });
  }
};

export const descontinuarBodegaProducto = async (req, res) => {
  try {
    const { bid } = req.params;
    const ingresoBodega = await IngresoBodega.findById(bid);
    if (!ingresoBodega) {
      return res.status(404).json({
        success: false,
        message: "Ingreso de bodega no encontrado",
      });
    }
    ingresoBodega.status = "DESCONTINUADO";
    await ingresoBodega.save();

    return res.status(200).json({
      success: true,
      message: "Ingreso de bodega descontinuado con éxito",
      ingreso: ingresoBodega,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al descontinuar el ingreso de bodega",
      error: err.message,
    });
  }
};

export const buscarIngresoBodegaPorId = async (req, res) => {
  try {
    const { bid } = req.params;
    const ingresoBodega = await IngresoBodega.findById(bid).populate("product"); // Popula los detalles del producto

    if (!ingresoBodega) {
      return res.status(404).json({
        success: false,
        message: "Ingreso de bodega no encontrado",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Ingreso de bodega encontrado",
      ingreso: ingresoBodega,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al buscar el ingreso de bodega",
      error: err.message,
    });
  }
};
