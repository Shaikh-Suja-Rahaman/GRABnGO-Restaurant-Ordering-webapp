import swaggerJSDoc from 'swagger-jsdoc'

const SWAGGER_URL = process.env.SWAGGER_URL || `http://localhost:5001`

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Ordering API',
      version: '1.0.0',
      description: 'API documentation for the Restaurant Ordering backend'
    },
    servers: [
      { url: SWAGGER_URL, description: 'Local server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  // files containing annotations as above
  apis: ['./routes/*.js', './controllers/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
