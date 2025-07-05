import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import validate from '../middleware/validate'
import Book from '../models/Book'
import Issue from '../models/Issue'
import issueSchema from '../validators/issueValidator'

const router = express.Router()

// Get all book issues with filter, search, and pagination
router.get('/', auth(['admin']), async (req: Request, res: Response) => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query

        const currentPage = parseInt(page as string, 10)
        const perPage = parseInt(limit as string, 10)
        const skip = (currentPage - 1) * perPage

        const query: any = {}
        if (status) query.status = status

        const issues = await Issue.find(query)
            .populate({
                path: 'book',
                match: search
                    ? { title: { $regex: search as string, $options: 'i' } }
                    : {},
            })
            .populate({
                path: 'user',
                match: search
                    ? {
                          $or: [
                              {
                                  name: {
                                      $regex: search as string,
                                      $options: 'i',
                                  },
                              },
                              {
                                  username: {
                                      $regex: search as string,
                                      $options: 'i',
                                  },
                              },
                          ],
                      }
                    : {},
            })
            .skip(skip)
            .limit(perPage)

        const filteredIssues = issues.filter(
            (issue) => issue.book && issue.user
        )
        const total = await Issue.countDocuments(query)

        res.json({
            count: filteredIssues.length,
            page: currentPage,
            page_size: perPage,
            total_page: Math.ceil(total / perPage),
            results: filteredIssues,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Get single issue by ID
router.get(
    '/:id',
    auth(['admin', 'student']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const issue = await Issue.findById(req.params.id).populate(
                'book user'
            )
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' })
                return
            }
            res.json(issue)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
)

// Request a book issue
router.post(
    '/',
    auth(['student']),
    validate(issueSchema),
    async (req: any, res: Response) => {
        try {
            const { book: bookId } = req.body
            const book = await Book.findById(bookId)
            if (!book || book.stock <= 0) {
                res.status(400).json({ message: 'Book not available' })
                return
            }

            const issue = new Issue({
                book: bookId,
                user: req.user.id,
                status: 'pending',
                issue_date: new Date(),
            })

            await issue.save()
            await Book.findByIdAndUpdate(bookId, { $inc: { stock: -1 } })

            res.status(201).json({
                message: 'Book issue requested successfully',
            })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Approve a book issue
router.put(
    '/:id/approve',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const issue = await Issue.findByIdAndUpdate(
                req.params.id,
                { status: 'approved', issue_date: new Date() },
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
                { status: 'returned', return_date: new Date() },
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

// Delete an issue
router.delete(
    '/:id',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const issue = await Issue.findByIdAndDelete(req.params.id)
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' })
                return
            }

            if (issue.status !== 'returned') {
                await Book.findByIdAndUpdate(issue.book, { $inc: { stock: 1 } })
            }

            res.json({ message: 'Issue deleted successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
