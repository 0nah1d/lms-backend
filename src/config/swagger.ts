import dotenv from 'dotenv'
dotenv.config()

import swaggerAutogen from 'swagger-autogen'
import path from 'path'
import fs from 'fs'

const swagger = swaggerAutogen()

const outputFile = './swagger.json'
const endpointsFiles = [path.join(__dirname, '../routes/*.ts')]

const doc = {
    info: {
        version: '1.0.0',
        title: 'Library Management System API',
        description: 'API for Library Management System',
    },
    host: `localhost:${process.env.PORT || 5000}`,
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
    security: [{ BearerAuth: [] }],
}

export async function generateSwaggerDocsOnce(): Promise<void> {
    if (!fs.existsSync(outputFile)) {
        await swagger(outputFile, endpointsFiles, doc)
        console.log('Swagger JSON generated.')
    } else {
        console.log('Swagger JSON already exists. Skipping generation.')
    }
}
