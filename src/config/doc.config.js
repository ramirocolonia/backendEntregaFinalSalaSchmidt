import __dirname from "../utils.js";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  definition:{
    openapi: "3.0.1",
    info: {
      title: "Documentacion api de ecommerce",
      version: "1.0.0",
      description: "Definicion de endpoints para la api de ecommerce"
    }
  },
  apis: [`${path.join(__dirname, "docs/**/*.yaml")}`] //ruta para los archivos de configuracion
}

// variable que interpreta las opciones
export const swaggerSpecs = swaggerJSDoc(swaggerOptions);