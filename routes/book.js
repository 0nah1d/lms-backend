const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const auth = require('../middleware/auth')

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('category department')
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new book
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const book = new Book(req.body)
        await book.save()
        res.status(201).json(book)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update a book
router.put('/:id', auth(['admin']), async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if (!book) return res.status(404).json({ message: 'Book not found' })
        res.json(book)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a book
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        if (!book) return res.status(404).json({ message: 'Book not found' })
        res.json({ message: 'Book deleted' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
