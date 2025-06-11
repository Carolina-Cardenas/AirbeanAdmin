import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AirBean Admin API",
      version: "1.0.0",
      description: "API för autentisering och admin-funktioner",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Ajusta según dónde están tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
