import pdfkit from "pdfkit";
import fs from "fs";
import Carrito from "./carrito.model.js";
import Producto from "../product/product.model.js";

export const generarFactura = async (req, res) => {
  try {
    const { carritoId } = req.params;
    const { nit = "CF" } = req.body; // Si no envían NIT, se usa "CF"

    const carrito = await Carrito.findById(carritoId).populate(
      "productos.producto"
    );
    if (!carrito) {
      return res
        .status(404)
        .json({ success: false, message: "Carrito no encontrado" });
    }

    const doc = new pdfkit();
    const filePath = `./facturas/factura_${carritoId}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Encabezado
    doc.fontSize(18).text("Gracias por comprar", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`NIT: ${nit}`);
    doc.moveDown();

    // Tabla de productos
    doc.text("Productos:", { underline: true });
    carrito.productos.forEach(({ producto, cantidad }) => {
      doc.text(
        `${producto.nombre} - Cantidad: ${cantidad} - Precio: Q${
          producto.precio
        } - Subtotal: Q${producto.precio * cantidad}`
      );
    });

    doc.moveDown();
    doc.text(`Total: Q${carrito.total}`, { bold: true });
    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, `Factura_${carritoId}.pdf`, (err) => {
        if (err) {
          console.error("Error al descargar la factura:", err);
          res
            .status(500)
            .json({ success: false, message: "Error al generar la factura" });
        }
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al generar la factura",
        error: error.message,
      });
  }
};
