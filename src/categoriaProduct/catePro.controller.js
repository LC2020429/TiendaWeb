import CategoryProduct from "./catePro.model.js";
import {reassignProductsToDefaultCategory} from "../helpers/status-validators.js" ;
// pasar los if a un validator
export const saveCategory = async (req, res) => {
  try {
    const { nombreCategoria, descripcionCategoria } = req.body;

    if (!nombreCategoria || !descripcionCategoria) {
      return res.status(400).json({
        success: false,
        message: "El nombre y la descripción de la categoría son obligatorios",
      });
    }

    const existingCategory = await CategoryProduct.findOne({ nombreCategoria });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `La categoría ${nombreCategoria} ya existe.`,
      });
    }

    const category = new CategoryProduct({
      nombreCategoria,
      descripcionCategoria,
    });
    await category.save();

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al guardar la categoría",
      error: error.message,
    });
  }
};

export const findCategory = async (req, res) => {
  try {
    const { cpid } = req.params;
    const category = await CategoryProduct.findById(cpid);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la categoría",
      error: err.message,
    });
  }
};

export const listCategories = async (req, res) => {
  try {
    const { limite = 20, desde = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
      CategoryProduct.countDocuments(query),
      CategoryProduct.find(query).skip(Number(desde)).limit(Number(limite)),
    ]);

    return res.status(200).json({
      success: true,
      total,
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: err.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { cpid } = req.params;
    const data = req.body;

    const updatedCategory = await CategoryProduct.findByIdAndUpdate(
      cpid,
      data,
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoría actualizada",
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error: err.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { cpid } = req.params;
    console.log("ID recibido:", cpid); // Verifica el ID que se recibe

    const categoria = await CategoryProduct.findById(cpid); // Asegúrate de que cpid sea el ID correcto

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    categoria.status = false;
    categoria.descripcion = "Categoría eliminada"; // O cualquier valor que desees asignar
    await categoria.save();

    await reassignProductsToDefaultCategory(cpid);

    return res.status(200).json({
      success: true,
      message: "Categoría eliminada y productos reasignados correctamente",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
      error: err.message,
    });
  }
};
