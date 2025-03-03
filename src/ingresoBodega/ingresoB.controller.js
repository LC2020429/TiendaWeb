import IngresoBodega from "./ingresoBodega.model.js";

// Guardar un ingreso de bodega
export const guardarIngresoBodega = async (req, res) => {
  try {
    const { encargadoBodega, cantProducto, schemaProduct } = req.body;

    if (!encargadoBodega || !schemaProduct) {
      return res.status(400).json({
        success: false,
        message:
          "El nombre del encargado y el id del producto son obligatorios",
      });
    }

    const ingreso = new IngresoBodega({
      encargadoBodega,
      cantProducto,
      schemaProduct,
    });
    await ingreso.save();

    res.status(201).json({
      success: true,
      ingreso,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al guardar el ingreso de bodega",
      error: error.message,
    });
  }
};

// Obtener un ingreso de bodega por ID
export const encontrarIngresoBodega = async (req, res) => {
  try {
    const { bid } = req.params;
    const ingreso = await IngresoBodega.findById(bid).populate("schemaProduct");

    if (!ingreso) {
      return res.status(404).json({
        success: false,
        message: "Ingreso de bodega no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      ingreso,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el ingreso de bodega",
      error: err.message,
    });
  }
};

// Listar ingresos de bodega con paginación
export const listIngresosBodega = async (req, res) => {
  try {
    const { limite = 20, desde = 0 } = req.query;
    const query = {};

    const [total, ingresos] = await Promise.all([
      IngresoBodega.countDocuments(query),
      IngresoBodega.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("schemaProduct"),
    ]);

    return res.status(200).json({
      success: true,
      total,
      ingresos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los ingresos de bodega",
      error: err.message,
    });
  }
};

export const deleteIngresoBodega = async (req, res) => {
  try {
    const { bid } = req.params;

    const bodega = await User.findByIdAndUpdate(
      bid,
      { status: false },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      error: err.message,
    });
  }
};

// Actualizar un ingreso de bodega
export const updateIngresoBodega = async (req, res) => {
  try {
    const { bid } = req.params;
    const data = req.body;

    const updatedIngreso = await IngresoBodega.findByIdAndUpdate(bid, data, {
      new: true,
    });

    if (!updatedIngreso) {
      return res.status(404).json({
        success: false,
        message: "Ingreso de bodega no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ingreso de bodega actualizado",
      ingreso: updatedIngreso,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el ingreso de bodega",
      error: err.message,
    });
  }
};
