import Product from "./product.model.js";
import CategoryProduct from "../categoriaProduct/catePro.model.js";
export const guardarProduct = async (req, res) => {
  try {
    let {
      nombreProducto,
      precio,
      productFoto,
      descripcionEspecificaP,
      categoriaProducto,
    } = req.body;

    nombreProducto = nombreProducto.toLowerCase();

    const product = new Product({
      nombreProducto,
      precio,
      productFoto,
      descripcionEspecificaP,
      categoriaProducto,
    });

    await product.save();

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al guardar el producto",
      error: error.message,
    });
  }
};

export const buscarProducto = async (req, res) => {
  try {
    const { pid } = req.params;
    const producto = await Product.findById(pid).populate("categoriaProducto");

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      producto,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      error: err.message,
    });
  }
};

export const listarProductos = async (req, res) => {
  try {
    let { limite = 20, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);
    const query = { status: true };

    console.log("limite:", limite, "desde:", desde);

    const [total, productos] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query) // Buscar los productos con el query
        .populate("categoriaProducto")
        .skip(desde) // Desplazamiento de productos
        .limit(limite), // Límite de productos por página
    ]);

    return res.status(200).json({
      success: true,
      total,
      productos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: err.message,
    });
  }
};

export const listarProductosDeleted = async (req, res) => {
  try {
    let { limite = 20, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);
    const query = { status: false };

    console.log("limite:", limite, "desde:", desde);

    const [total, productos] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query) // Buscar los productos con el query
        .populate("categoriaProducto")
        .skip(desde) // Desplazamiento de productos
        .limit(limite), // Límite de productos por página
    ]);

    return res.status(200).json({
      success: true,
      total,
      productos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: err.message,
    });
  }
};

export const listarProductosMostSell = async (req, res) => {
  try {
    let { limite = 20, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);
    const query = {};

    console.log("limite:", limite, "desde:", desde);

    const [total, productos] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate("categoriaProducto")
        .sort({ ventas: -1 })
        .skip(desde)
        .limit(limite),
    ]);

    return res.status(200).json({
      success: true,
      total,
      productos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: err.message,
    });
  }
};

export const listarProductosPorCategoria = async (req, res) => {
  try {
    const { categoriaNombre } = req.params;

    // Buscar la categoría sin tener en cuenta las mayúsculas/minúsculas
    const categoria = await CategoryProduct.findOne({
      nombreCategoria: { $regex: new RegExp(`^${categoriaNombre}$`, "i") }, // 'i' hace la búsqueda insensible a mayúsculas
      status: true,
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `Categoría '${categoriaNombre}' no encontrada o no disponible`,
      });
    }

    const productos = await Product.find({
      categoriaProducto: categoria._id,
      status: true,
    }).populate("categoriaProducto");

    return res.status(200).json({
      success: true,
      productos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos por categoría",
      error: err.message,
    });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { pid } = req.params;
    let data = req.body;

    if (data.nombreProducto) {
      data.nombreProducto = data.nombreProducto.toLowerCase(); // Convierte a minúsculas si se envía el nombre
    }

    const updatedProduct = await Product.findByIdAndUpdate(pid, data, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error: err.message,
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { pid } = req.params;

    const producto = await Product.findById(pid);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }
    producto.status = false;
    await producto.save();
    return res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente",
      producto,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
      error: err.message,
    });
  }
};
