"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return; // exit middleware, no return value
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (roles.length &&
                typeof decoded === 'object' &&
                !roles.includes(decoded.role)) {
                res.status(403).json({ message: 'Access denied' });
                return;
            }
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
    };
};
exports.default = auth;
