import pdfkit from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Carrito from "../carrito/carrito.model.js";
import IngresoBodega from "../ingresoBodega/ingresoB.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const facturasDir = path.resolve(
  __dirname,
  "../../public/uploads/carrito-facturas"
);

if (!fs.existsSync(facturasDir)) {
  fs.mkdirSync(facturasDir, { recursive: true });
}

export const generarFactura = async (req, res) => {
  try {
    const { carritoId } = req.params;
    const { nit = "CF" } = req.body;

    const carrito = await Carrito.findById(carritoId).populate(
      "productos.producto"
    );

    if (!carrito) {
      return res
        .status(404)
        .json({ success: false, message: "Carrito no encontrado" });
    }

    if (carrito.facturado) {
      return res.status(400).json({
        success: false,
        message: "Este carrito ya ha sido facturado.",
      });
    }

    carrito.estado = "CANCEL";
    carrito.facturado = true;
    await carrito.save();

    for (const { producto, cantidad } of carrito.productos) {
      const stockBodega = await IngresoBodega.findOne({
        product: producto._id,
        status: "ACTIVO",
      });

      if (!stockBodega || stockBodega.cantProducto < cantidad) {
        return res.status(400).json({
          success: false,
          message: `No hay suficiente stock en la bodega para el producto ${producto.nombreProducto}`,
        });
      }

      stockBodega.cantProducto -= cantidad;
      await stockBodega.save(); 
    }

    const doc = new pdfkit();
    const formattedDate = new Date()
      .toLocaleDateString("es-ES")
      .replace(/\//g, "-");
    const filePath = path.join(
      facturasDir,
      `factura_${carritoId}_${formattedDate}.pdf`
    );
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text("Gracias por comprar", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`NIT: ${nit}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.text("Productos:", { underline: true });
    doc.moveDown();

    const startY = doc.y;
    doc.fontSize(10).text("Producto", 50, startY);
    doc.text("Cantidad", 200, startY);
    doc.text("Precio", 300, startY);
    doc.text("Subtotal", 400, startY);
    doc.moveDown(1);

    carrito.productos.forEach(({ producto, cantidad }) => {
      const subtotal = producto.precio * cantidad;
      doc.text(producto.nombreProducto, 50, doc.y);
      doc.text(cantidad.toString(), 200, doc.y);
      doc.text(`Q${producto.precio}`, 300, doc.y);
      doc.text(`Q${subtotal}`, 400, doc.y);
      doc.moveDown();
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
    res.status(500).json({
      success: false,
      message: "Error al generar la factura",
      error: error.message,
    });
  }
};
