import CategoryProduct from "../categoriaProduct/catePro.model.js";
import Product from "../product/product.model.js";

export const categoryIsActive = async (cpid = "") => {
  const categoria = await CategoryProduct.findById(cpid);

  if (!categoria) {
    throw new Error("No existe la categoría con el ID proporcionado");
  }

  if (!categoria.status) {
    throw new Error(
      "La categoría fue eliminada anteriormente y no puede usarse"
    );
  }
};

export const nameCategory = async (nombreCategoria = "") => {
  const existe = await CategoryProduct.findOne({ nombreCategoria });
  if (existe) {
    throw new Error(
      `El nombre de esta categoría ${nombreCategoria} ya está en el sistema`
    );
  }
};

export const productExists = async (pid = "") => {
  const product = await Product.findById(pid);
  if (!product) {
    throw new Error("No existe el producto con el ID proporcionado");
  }
};

export const productNameExists = async (nombreProducto = "") => {
  const nombreLowerCase = nombreProducto.toLowerCase();
  const existe = await Product.findOne({ nombreProducto: nombreLowerCase });
  if (existe) {
    throw new Error(`El producto '${nombreLowerCase}' ya existe.`);
  }
};
