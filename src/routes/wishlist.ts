import express, { Response } from 'express'
import auth from '../middleware/auth'
import Wishlist from '../models/Wishlist'
import { paginate } from '../utils/paginate'


const router = express.Router()

// Add to Wishlist
router.post(
    '/',
    auth(['student', 'admin']),
    async (req: any, res: Response) => {
        try {
            const { book } = req.body
            if (!book) {
                res.status(400).json({ message: 'Book ID is required' })
                return
            }

            const exists = await Wishlist.findOne({ user: req.user.id, book })
            if (exists) {
                res.status(409).json({ message: 'Already in wishlist' })
                return
            }

            const entry = await Wishlist.create({ user: req.user.id, book })
            res.status(201).json({ message: 'Book added to wishlist', entry })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
)

// Get Wishlist of Current User
router.get(
    '/',
    auth(['student', 'admin']),
    async (req: any, res: Response) => {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10

            const paginationResult = await paginate({
                model: Wishlist,
                query: { user: req.user.id },
                sort: { createdAt: -1 },
                page,
                limit,
                populate: ['book'],
                baseUrl: '/wishlist',
                originalQuery: req.query as Record<string, any>,
            })

            res.status(200).json(paginationResult)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
)

router.get(
    '/:bookId/check',
    auth(['student', 'admin']),
    async (req: any, res: Response) => {
        try {
            const bookId = req.params.bookId
            const exists = await Wishlist.exists({ user: req.user.id, book: bookId })
            res.status(200).json({ inWishlist: !!exists })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)


// Remove from Wishlist
router.delete(
    '/:bookId',
    auth(['student', 'admin']),
    async (req: any, res: Response) => {
        try {
            const bookId = req.params.bookId
            const deleted = await Wishlist.findOneAndDelete({ user: req.user.id, book: bookId })

            if (!deleted) {
                res.status(404).json({ message: 'Book not found in wishlist' })
                return
            }

            res.status(200).json({ message: 'Book removed from wishlist' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
)

export default router
