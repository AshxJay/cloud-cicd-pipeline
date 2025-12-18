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
        url: "https://cloud-cicd-pipeline.vercel.app/",
        description: "Production server"
      }
    ]
  },
  apis: ["./index.js"]
// where swagger reads comments from
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
