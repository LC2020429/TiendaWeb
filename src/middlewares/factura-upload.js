import pdfkit from "pdfkit";
import fs from "fs";
import path from "path"; // Importa 'path' para trabajar con rutas de manera segura
import { fileURLToPath } from "url"; // Importar fileURLToPath
import Carrito from "../carrito/carrito.model.js";

// Usar import.meta.url para obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url); // Convierte la URL del archivo en ruta
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo

// Generar la ruta del directorio donde se almacenarán las facturas
const facturasDir = path.resolve(
  __dirname,
  "../../public/uploads/carrito-facturas"
);

// Verifica si el directorio 'carrito-facturas' existe, y si no, lo crea
if (!fs.existsSync(facturasDir)) {
  fs.mkdirSync(facturasDir, { recursive: true }); // Crear el directorio de forma recursiva
}

export const generarFactura = async (req, res) => {
  try {
    const { carritoId } = req.params; // carritoId sigue siendo un parámetro de la URL
    const { nit = "CF" } = req.body; // El nit se toma del cuerpo de la solicitud (POST)

    // Buscar el carrito y sus productos
    const carrito = await Carrito.findById(carritoId).populate(
      "productos.producto"
    );

    if (!carrito) {
      return res
        .status(404)
        .json({ success: false, message: "Carrito no encontrado" });
    }

    // Validar si el carrito ya ha sido facturado
    if (carrito.facturado) {
      return res.status(400).json({
        success: false,
        message: "Este carrito ya ha sido facturado.",
      });
    }

    // Cambiar el estado del carrito a "CANCEL" después de generar la factura
    carrito.estado = "CANCEL";
    carrito.facturado = true; // Marcar el carrito como facturado
    await carrito.save(); // Guardar los cambios en el carrito

    // Crear el documento PDF
    const doc = new pdfkit();

    // Formatear la fecha
    const formattedDate = new Date()
      .toLocaleDateString("es-ES")
      .replace(/\//g, "-");

    // Definir la ruta completa para guardar la factura PDF
    const filePath = path.join(
      facturasDir,
      `factura_${carritoId}_${formattedDate}.pdf`
    );
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Encabezado de la factura
    doc.fontSize(18).text("Gracias por comprar", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.text(`NIT: ${nit}`); // Aquí mostramos el NIT recibido en el body
    doc.moveDown();

    // Línea de separación
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Sección de productos
    doc.text("Productos:", { underline: true });
    doc.moveDown();

    // Crear tabla para los productos
    const startY = doc.y;
    doc.fontSize(10).text("Producto", 50, startY);
    doc.text("Cantidad", 200, startY);
    doc.text("Precio", 300, startY);
    doc.text("Subtotal", 400, startY);
    doc.moveDown(1);

    // Recorrer los productos del carrito y agregar información al PDF
    carrito.productos.forEach(({ producto, cantidad }) => {
      const subtotal = producto.precio * cantidad;
      doc.text(producto.nombreProducto, 50, doc.y); // Cambié nombre a nombreProducto
      doc.text(cantidad.toString(), 200, doc.y);
      doc.text(`Q${producto.precio}`, 300, doc.y);
      doc.text(`Q${subtotal}`, 400, doc.y);
      doc.moveDown();
    });

    // Total de la compra
    doc.moveDown();
    doc.text(`Total: Q${carrito.total}`, { bold: true });
    doc.end();

    // Una vez que el archivo se haya guardado, permitir que el usuario lo descargue
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
