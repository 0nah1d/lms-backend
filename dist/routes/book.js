"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Book_1 = __importDefault(require("../models/Book"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book_1.default.find().populate('category department');
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Create a new book
router.post('/', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const book = new Book_1.default(req.body);
        await book.save();
        res.status(201).json(book);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a book
router.put('/:id', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const book = await Book_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(book);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete a book
router.delete('/:id', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const book = await Book_1.default.findByIdAndDelete(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json({ message: 'Book deleted' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.default = router;
