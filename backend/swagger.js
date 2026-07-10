import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Ordering API',
      version: '1.0.0',
      description: 'API documentation for the Restaurant Ordering backend'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local server' }
    ]
  },
  // files containing annotations as above
  apis: ['./routes/*.js', './controllers/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
