import express, { Request, Response } from 'express'
import Book, { IBook } from '../models/Book'
import auth from '../middleware/auth'

const router = express.Router()

// Get all books
router.get('/', async (req: Request, res: Response) => {
    try {
        const books = await Book.find().populate('category department')
        res.json(books)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new book
router.post(
    '/',
    auth(['admin']),
    async (req: Request<{}, {}, Partial<IBook>>, res: Response) => {
        try {
            const book = new Book(req.body)
            await book.save()
            res.status(201).json(book)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Update a book
router.put(
    '/:id',
    auth(['admin']),
    async (req: Request<{ id: string }, {}, Partial<IBook>>, res: Response) => {
        try {
            const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            if (!book) {
                res.status(404).json({ message: 'Book not found' })
                return
            }
            res.json(book)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Delete a book
router.delete(
    '/:id',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const book = await Book.findByIdAndDelete(req.params.id)
            if (!book) {
                res.status(404).json({ message: 'Book not found' })
                return
            }
            res.json({ message: 'Book deleted' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
