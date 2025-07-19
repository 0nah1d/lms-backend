import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import Book from '../models/Book'
import Comment from '../models/Comment'
import { paginate } from '../utils/paginate'

const router = express.Router()

// Create Comment on a Book
router.post(
    '/:bookId',
    auth(['student', 'admin']),
    async (req: any, res: Response) => {
        try {
            const { bookId } = req.params
            const { text } = req.body

            const comment = await Comment.create({
                user: req.user.id,
                book: bookId,
                text,
            })

            await Book.findByIdAndUpdate(bookId, {
                $push: { comments: comment._id },
            })

            res.status(201).json({ message: 'Comment added successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
)


// Get All Comments for a Book
router.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const paginationResult = await paginate({
            model: Comment,
            query: { book: bookId },
            sort: { createdAt: -1 },
            page,
            limit,
            populate: ['user'],
            baseUrl: `/comment/${bookId}`,
            originalQuery: req.query as Record<string, any>,
        })

        res.json(paginationResult)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})


// Delete Comment (owner or admin only)
router.delete(
    '/:id',
    auth(['student', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const comment = await Comment.findById(req.params.id)

            if (!comment) {
                 res.status(404).json({ message: 'Comment not found' })
                return
            }

            if (comment.user.toString() !== (req as any).user.id) {
                 res
                    .status(403)
                    .json({ message: 'You are not authorized to delete this comment' })
                return
            }

            await comment.deleteOne()
            res.status(200).json({ message: 'Comment deleted successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)


export default router
