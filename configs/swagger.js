import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Tienda Web API",
      version: "1.0.0",
      description: "API documentation for WebStore",
    },
    servers: [
      {
        url: "http://localhost:3005",
      },
    ],
  },
  apis: [
    "./src/auth/auth.routes.js",
    "./src/user/user.routes.js",
    "./src/product/product.routes.js",
    "./src/categoriaProduct/catePro.routes.js",
    "./src/carrito/carrito.routes.js",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };