"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSwaggerDocsOnce = generateSwaggerDocsOnce;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const swagger = (0, swagger_autogen_1.default)();
const outputFile = './swagger.json';
const endpointsFiles = [path_1.default.join(__dirname, '../routes/*.ts')];
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
};
async function generateSwaggerDocsOnce() {
    if (!fs_1.default.existsSync(outputFile)) {
        await swagger(outputFile, endpointsFiles, doc);
        console.log('Swagger JSON generated.');
    }
    else {
        console.log('Swagger JSON already exists. Skipping generation.');
    }
}
