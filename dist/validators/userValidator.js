"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required().messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be less than 30 characters long',
        'string.empty': 'Username is required',
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email address',
        'string.empty': 'Email is required',
    }),
    password: joi_1.default.string().min(8).max(25).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be less than 25 characters long',
        'string.empty': 'Password is required',
    }),
    confirm_password: joi_1.default.string()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({
        'any.only': 'Confirm password does not match',
        'string.empty': 'Confirm password is required',
    }),
    role: joi_1.default.string().valid('student', 'admin').default('student'),
});
