const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cloud Notes API",
      version: "1.0.0",
      description:
        "A cloud-hosted Notes API with JWT authentication, validation, and CI/CD"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server"
      },
      {
        url: "https://YOUR_VERCEL_URL",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./index.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
