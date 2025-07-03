"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatJoiErrors_1 = __importDefault(require("../utils/formatJoiErrors"));
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const formatted = (0, formatJoiErrors_1.default)(error);
            res.status(400).json(formatted);
            return;
        }
        ;
        req.validated = value;
        next();
    };
};
exports.default = validate;
