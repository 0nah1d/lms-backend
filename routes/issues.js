const express = require('express')
const router = express.Router()
const Issue = require('../models/Issue')
const Book = require('../models/Book')
const auth = require('../middleware/auth')

// Get all book issues
router.get('/', auth(['admin']), async (req, res) => {
    try {
        const issues = await Issue.find().populate('book user')
        res.json(issues)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Request a book issue
router.post('/', auth(['student']), async (req, res) => {
    try {
        const { bookId } = req.body
        const book = await Book.findById(bookId)
        if (!book || book.stock <= 0)
            return res.status(400).json({ message: 'Book not available' })

        const issue = new Issue({
            book: bookId,
            user: req.user.id,
        })
        await issue.save()
        await Book.findByIdAndUpdate(bookId, { $inc: { stock: -1 } })
        res.status(201).json(issue)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Approve a book issue
router.put('/:id/approve', auth(['admin']), async (req, res) => {
    try {
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status: 'approved', issueDate: Date.now() },
            { new: true }
        )
        if (!issue) return res.status(404).json({ message: 'Issue not found' })
        res.json(issue)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Return a book
router.put('/:id/return', auth(['admin']), async (req, res) => {
    try {
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status: 'returned', returnDate: Date.now() },
            { new: true }
        )
        if (!issue) return res.status(404).json({ message: 'Issue not found' })
        await Book.findByIdAndUpdate(issue.book, { $inc: { stock: 1 } })
        res.json(issue)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
