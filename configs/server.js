"use strict";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import categoryProductRoutes from "../src/categoriaProduct/catePro.routes.js";
import productRoutes from "../src/product/product.routes.js"
import categoryPro from "../src/categoriaProduct/catePro.model.js";
import bodegaRoutes from "../src/ingresoBodega/ingresoB.routes.js"
//import { swaggerDocs, swaggerUi } from "./swagger.js";

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};

const crearCategoria = async () => {
  try {
    const categoriaExist = await categoryPro.findOne({
      nombreCategoria: "Default",
    });

    if (!categoriaExist) {
      const defaultCategory = new categoryPro({
        nombreCategoria: "Default",
        descripcionCategoria: "Productos varios",
        status: true,
      });
      await defaultCategory.save();
    }
  } catch (err) {
    console.log(`Error al crear la categoría por defecto: ${err}`);
  }
};

const routes = (app) => {
  app.use("/tiendaWeb/v1/auth", authRoutes);
  app.use("/tiendaWeb/v1/user", userRoutes);
  app.use("/tiendaWeb/v1/categoriaPro", categoryProductRoutes);
  app.use("/tiendaWeb/v1/product", productRoutes);
  app.use("/tiendaWeb/v1/tienda", bodegaRoutes);
  // app.use("/coperexInterFer/v1/reports", excelRoutes);

  //app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
const conectarDB = async () => {
  try {
    await dbConnection();
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};

export const initServer = () => {
  const app = express();
  try {
    middlewares(app);
    conectarDB();
    routes(app);
    // crearAdministrador();
    crearCategoria();
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`Server running on port ${port} `);
    });
  } catch (err) {
    console.log(`Server init failed: ${err}`);
  }
};
