"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Issue_1 = __importDefault(require("../models/Issue"));
const Book_1 = __importDefault(require("../models/Book"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Get all book issues
router.get('/', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const issues = await Issue_1.default.find().populate('book user');
        res.json(issues);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Request a book issue
router.post('/', (0, auth_1.default)(['student']), async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book_1.default.findById(bookId);
        if (!book || book.stock <= 0) {
            res.status(400).json({ message: 'Book not available' });
            return;
        }
        const issue = new Issue_1.default({
            book: bookId,
            user: req.user.id,
        });
        await issue.save();
        await Book_1.default.findByIdAndUpdate(bookId, { $inc: { stock: -1 } });
        res.status(201).json(issue);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Approve a book issue
router.put('/:id/approve', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const issue = await Issue_1.default.findByIdAndUpdate(req.params.id, { status: 'approved', issueDate: Date.now() }, { new: true });
        if (!issue) {
            res.status(404).json({ message: 'Issue not found' });
            return;
        }
        res.json(issue);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Return a book
router.put('/:id/return', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const issue = await Issue_1.default.findByIdAndUpdate(req.params.id, { status: 'returned', returnDate: Date.now() }, { new: true });
        if (!issue) {
            res.status(404).json({ message: 'Issue not found' });
            return;
        }
        await Book_1.default.findByIdAndUpdate(issue.book, { $inc: { stock: 1 } });
        res.json(issue);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.default = router;
