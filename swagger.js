const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description: "Cloud-based Notes API with CI/CD and MongoDB Atlas"
    },
    servers: [
      {
        url: "https://cloud-cicd-pipeline.vercel.app/
    ]
  },
  apis: ["./index.js"]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
