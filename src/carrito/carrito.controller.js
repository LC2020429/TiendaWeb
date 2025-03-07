import Carrito from "./carrito.model.js";
import Producto from "../product/product.model.js";
import IngresoBodega from "../ingresoBodega/ingresoB.model.js";
import Usuario from "../user/user.model.js";

export const agregarCarrito = async (req, res) => {
  try {
    const { uid } = req.params; // usuarioId en la URL
    const { productos } = req.body; // Productos enviados en el body

    // Asegúrate de que el usuario del token coincida con el usuario de la URL
    if (req.usuario._id.toString() !== uid) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para agregar productos al carrito de otro usuario",
      });
    }

    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const productosMap = new Map();
    productos.forEach(({ productoId, cantidad }) => {
      if (productosMap.has(productoId)) {
        productosMap.set(productoId, productosMap.get(productoId) + cantidad);
      } else {
        productosMap.set(productoId, cantidad);
      }
    });

    const productosUnicos = [...productosMap.entries()].map(
      ([productoId, cantidad]) => ({
        productoId,
        cantidad,
      })
    );

    console.log("Productos agrupados:", productosUnicos);

    // Obtener todos los productos de la base de datos en una sola consulta
    const productosIds = productosUnicos.map((p) => p.productoId);
    const productosDB = await Producto.find({ _id: { $in: productosIds } });
    const bodegaStock = await IngresoBodega.find({
      product: { $in: productosIds },
      status: "ACTIVO",
    });

    // Crear un nuevo carrito
    const nuevoCarrito = new Carrito({
      usuario: uid,
      productos: [],
      total: 0,
      estado: "ACTIVO",
    });

    for (let { productoId, cantidad } of productosUnicos) {
      const producto = productosDB.find((p) => p._id.toString() === productoId);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${productoId} no encontrado`,
        });
      }

      const stock = bodegaStock.find(
        (b) => b.product.toString() === productoId
      );
      if (!stock || stock.cantProducto < cantidad) {
        return res.status(400).json({
          success: false,
          message: `No hay suficiente stock en la bodega para el producto`,
        });
      }

      // Agregar producto al carrito
      nuevoCarrito.productos.push({
        producto: productoId,
        cantidad,
        precio: producto.precio,
      });
    }

    nuevoCarrito.calcularTotal();
    await nuevoCarrito.save();

    return res.status(201).json({
      success: true,
      message: "Carrito creado y productos agregados correctamente",
      carrito: nuevoCarrito,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al crear el carrito",
      error: err.message,
    });
  }
};

export const listarCarritosActivosPorUsuario = async (req, res) => {
  try {
    const { uid } = req.params;
    const carritos = await Carrito.find({
      usuario: uid,
      estado: "ACTIVO",
    });

    if (!carritos || carritos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tienes carritos activos",
      });
    }

    return res.status(200).json({
      success: true,
      carritos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al listar los carritos activos",
      error: err.message,
    });
  }
};

export const listarTodosCarritosPorUsuario = async (req, res) => {
  try {
    const { uid } = req.params;
    const carritos = await Carrito.find({ usuario: uid });

    if (!carritos || carritos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tienes carritos",
      });
    }

    return res.status(200).json({
      success: true,
      carritos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al listar todos los carritos",
      error: err.message,
    });
  }
};

export const editarCarrito = async (req, res) => {
  try {
    const { uid, carritoId } = req.params;
    const { productoId, cantidad } = req.body;

    if (cantidad === 0) {
      return res.status(400).json({
        success: false,
        message: "La cantidad no puede ser 0 para editar el carrito.",
      });
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    const ingresoBodega = await IngresoBodega.findOne({
      product: productoId,
      status: "ACTIVO",
    });
    if (!ingresoBodega || ingresoBodega.cantProducto < cantidad) {
      return res.status(400).json({
        success: false,
        message: "No hay suficiente stock en la bodega para este producto",
      });
    }

    const carrito = await Carrito.findOne({
      _id: carritoId,
      usuario: uid,
      estado: "ACTIVO",
    });
    if (!carrito) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado o ya cancelado",
      });
    }

    const productoExistente = carrito.productos.find(
      (prod) => prod.producto.toString() === productoId
    );

    if (productoExistente) {
      productoExistente.cantidad = cantidad;
    } else {
      carrito.productos.push({
        producto: productoId,
        cantidad,
        precio: producto.precio,
      });
    }

    carrito.calcularTotal();
    await carrito.save();

    return res.status(200).json({
      success: true,
      message: "Carrito actualizado correctamente",
      carrito,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al editar el carrito",
      error: err.message,
    });
  }
};

export const cancelarCarrito = async (req, res) => {
  const { carritoId } = req.params;

  try {
    const carrito = await Carrito.findById(carritoId);

    if (!carrito) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }
    carrito.estado = "DELETED";
    carrito.status = false;
    await carrito.save();

    return res.status(200).json({ msg: "Carrito cancelado exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error al cancelar el carrito", error: error.message });
  }
};

