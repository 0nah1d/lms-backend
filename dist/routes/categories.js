"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Category_1 = __importDefault(require("../models/Category"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category_1.default.find();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Create a new category
router.post('/', (0, auth_1.default)(['admin']), async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = new Category_1.default({ name, description });
        await category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a category
router.put('/:id', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json(category);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete a category
router.delete('/:id', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json({ message: 'Category deleted' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.default = router;
