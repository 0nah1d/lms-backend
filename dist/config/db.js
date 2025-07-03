"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(chalk_1.default.green('✓ MongoDB is connected'));
    }
    catch (error) {
        console.error(chalk_1.default.red(`✗ Failed to connect to MongoDB: ${error.message}`));
        process.exit(1);
    }
};
exports.default = connectDB;
