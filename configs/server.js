"use strict";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from "./mongo.js";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js"
//import { swaggerDocs, swaggerUi } from "./swagger.js";

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};
/*
const crearAdministrador = async () => {
  try {
    const adminExist = await User.findOne({ userName: "AdminOpinionGestor" });

    if (!adminExist) {      
      const encryptedPassword = await hash("Key40RAdm!nSuper");
      const admin = new User({
        apellidos: "Admin",
        userName: "AdminOpinionGestor",
        email: "AdminOpinionGestor@gmail.com",
        password: encryptedPassword,
        phone: 11110000,
      });
      await admin.save();
    }
  } catch (err) {
    console.log(`Error al crear el administrador: ${err}`);
  }
};
*/
/*
const crearCategoria = async () => {
  try {
    const categoriaExist = await Category.findOne({ categoryName: "Default" });

    if (!categoriaExist) {
      const defaultCategory = new Category({
        categoryName: "Default",
        vistasCategory: 0,
        status: true,
      });
      await defaultCategory.save();
    }
  } catch (err) {
    console.log(`Error al crear la categoría por defecto: ${err}`);
  }
};
*/

const routes = (app) => {
  app.use("/tiendaWeb/v1/auth", authRoutes);
  app.use("/tiendaWeb/v1/user", userRoutes);
 // app.use("/coperexInterFer/v1/categoria", categoryRoutes);
 // app.use("/coperexInterFer/v1/enterprise", enterpriseRoutes);
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
   // crearCategoria();
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`Server running on port ${port} `);
    });
  } catch (err) {
    console.log(`Server init failed: ${err}`);
  }
};
