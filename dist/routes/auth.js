"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate_1 = __importDefault(require("../middleware/validate"));
const userValidator_1 = require("../validators/userValidator");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.default)(userValidator_1.registerSchema), async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            const errors = {};
            if (existingUser.email === email) {
                errors.email = 'Email already exists';
            }
            if (existingUser.username === username) {
                errors.username = 'Username already exists';
            }
            res.status(400).json(errors);
            return;
        }
        const newUser = new User_1.default({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User_1.default.findOne({
            $or: [{ username }, { email: username }],
        });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({
                password: 'Invalid username/email or password.',
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: 'JWT secret not configured' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.default = router;
