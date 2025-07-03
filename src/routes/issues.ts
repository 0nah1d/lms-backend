import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import Book from '../models/Book'
import Issue from '../models/Issue'

const router = express.Router()

// Get all book issues
router.get('/', auth(['admin']), async (req: Request, res: Response) => {
    try {
        const issues = await Issue.find().populate('book user')
        res.json(issues)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Request a book issue
router.post('/', auth(['student']), async (req: any, res: Response) => {
    try {
        const { bookId } = req.body
        const book = await Book.findById(bookId)
        if (!book || book.stock <= 0) {
            res.status(400).json({ message: 'Book not available' })
            return
        }

        const issue = new Issue({
            book: bookId,
            user: req.user.id,
        })
        await issue.save()
        await Book.findByIdAndUpdate(bookId, { $inc: { stock: -1 } })

        res.status(201).json({ message: 'Book issue requested successfully' })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
})

// Approve a book issue
router.put(
    '/:id/approve',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const issue = await Issue.findByIdAndUpdate(
                req.params.id,
                { status: 'approved', issueDate: Date.now() },
                { new: true }
            )
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' })
                return
            }
            res.json({ message: 'Book issue approved successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Return a book
router.put(
    '/:id/return',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const issue = await Issue.findByIdAndUpdate(
                req.params.id,
                { status: 'returned', returnDate: Date.now() },
                { new: true }
            )
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' })
                return
            }

            await Book.findByIdAndUpdate(issue.book, { $inc: { stock: 1 } })
            res.json({ message: 'Book returned successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
