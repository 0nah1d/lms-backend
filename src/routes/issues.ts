import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import validate from '../middleware/validate'
import Book from '../models/Book'
import Issue from '../models/Issue'
import issueSchema from '../validators/issueValidator'
import { JwtPayload } from 'jsonwebtoken'
import { paginate } from '../utils/paginate'

const router = express.Router()

interface AuthRequest extends Request {
    user?: JwtPayload | string
}

// Get all book issues with filter, search, and pagination
router.get('/', auth(['admin']), async (req: Request, res: Response) => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query

        const currentPage = parseInt(page as string, 10)
        const perPage = parseInt(limit as string, 10)

        const query: any = {}
        if (status) query.status = status

        const paginated = await paginate({
            model: Issue,
            query,
            page: currentPage,
            limit: perPage,
            populate: ['book', 'user'],
            baseUrl: '/issues',
            originalQuery: req.query as Record<string, any>,
        })

        const filteredResults = paginated.results.filter(
            (issue: any) => issue.book && issue.user
        )

        const searchLower = ((search as string) || '').toLowerCase()
        const searchedResults = search
            ? filteredResults.filter(
                  (issue: any) =>
                      (issue.book.title &&
                          issue.book.title
                              .toLowerCase()
                              .includes(searchLower)) ||
                      (issue.user.name &&
                          issue.user.name
                              .toLowerCase()
                              .includes(searchLower)) ||
                      (issue.user.username &&
                          issue.user.username
                              .toLowerCase()
                              .includes(searchLower))
              )
            : filteredResults

        const statusOrder: Record<string, number> = {
            pending: 0,
            approved: 1,
            returned: 2,
        }
        const sortedResults = searchedResults.sort(
            (a: any, b: any) => statusOrder[a.status] - statusOrder[b.status]
        )

        res.json({
            ...paginated,
            count: sortedResults.length,
            results: sortedResults,
        })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

router.get(
    '/book/:bookId/check',
    auth(['student']),
    async (req: AuthRequest, res: Response) => {
        const { bookId } = req.params

        try {
            const userId = (req.user as JwtPayload).id

            const existingIssue = await Issue.findOne({
                book: bookId,
                user: userId,
                status: { $in: ['pending', 'approved'] },
            })

            if (existingIssue) {
                res.json({ alreadyIssued: true, status: existingIssue.status })
            } else {
                res.json({ alreadyIssued: false })
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
)

// issue book
router.post(
    '/',
    auth(['student']),
    validate(issueSchema),
    async (req: any, res: Response) => {
        try {
            const { book: bookId, return_date, quantity = 1 } = req.body

            const book = await Book.findById(bookId)
            if (!book || book.stock < quantity) {
                res.status(400).json({ message: 'Not enough stock available' })
                return
            }

            const issue = new Issue({
                book: bookId,
                user: req.user.id,
                quantity,
                status: 'pending',
                issue_date: new Date(),
                return_date: return_date,
            })

            await issue.save()
            await Book.findByIdAndUpdate(bookId, { $inc: { stock: -quantity } })

            res.status(201).json({
                message: 'Book issue requested successfully',
            })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// change status
router.patch(
    '/:id/status',
    auth(['admin']),
    async (
        req: Request<{ id: string }, {}, { status: string }>,
        res: Response
    ) => {
        try {
            const { status } = req.body
            if (!['pending', 'approved', 'returned'].includes(status)) {
                res.status(400).json({ message: 'Invalid status' })
                return
            }

            const issue = await Issue.findById(req.params.id)
            if (!issue) {
                res.status(404).json({ message: 'Issue not found' })
                return
            }

            const previousStatus = issue.status

            issue.status = status as 'pending' | 'approved' | 'returned'
            issue.return_date = status === 'returned' ? new Date() : undefined
            await issue.save()

            // Update book stock only if status is changed to 'returned' from another status
            if (status === 'returned' && previousStatus !== 'returned') {
                await Book.findByIdAndUpdate(issue.book, { $inc: { stock: 1 } })
            }

            res.json({ message: `Status updated to ${status}` })
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
