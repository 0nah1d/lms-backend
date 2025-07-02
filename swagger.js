require('dotenv').config()
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
// const endpointsFiles = ['./routes/*.js']
const endpointsFiles = ['./app.js']

const doc = {
    info: {
        version: '1.0.0',
        title: 'Library Management System API',
        description: 'API for Library Management System',
    },
    host: `localhost:${process.env.PORT}`,
    basePath: '/',
    schemes: ['http'],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter token in format: Bearer <token>',
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
}

swaggerAutogen(outputFile, endpointsFiles, doc)
    .then(() => {
        console.log('Swagger JSON generated successfully')
    })
    .catch((err) => {
        console.error('Error generating Swagger JSON:', err)
    })
