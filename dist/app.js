"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const chalk_1 = __importDefault(require("chalk"));
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}));
// Connect to MongoDB
(0, db_1.default)().then();
// JSON body parser
app.use(express_1.default.json());
(0, swagger_1.generateSwaggerDocsOnce)().then(() => {
    const swaggerDocument = require('../swagger.json');
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    // API Routes
    app.use('/', require('./routes/home').default);
    app.use('/auth', require('./routes/auth').default);
    app.use('/categories', require('./routes/categories').default);
    app.use('/departments', require('./routes/departments').default);
    app.use('/books', require('./routes/book').default);
    app.use('/issues', require('./routes/issues').default);
    // Start server
    const PORT = Number(process.env.PORT) || 5000;
    app.listen(PORT, () => console.log('Server running on ' + chalk_1.default.blue(`http://localhost:${PORT}`)));
});
