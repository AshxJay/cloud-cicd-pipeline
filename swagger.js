const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cloud Notes API",
      version: "1.0.0",
      description:
        "A cloud-hosted Notes API with JWT authentication, validation, CI/CD"
    },

    // IMPORTANT: Same-origin server (works on Vercel & local)
    servers: [
      {
        url: "/",
        description: "Same origin"
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

  // Swagger scans index.js for annotations
  apis: ["./index.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
