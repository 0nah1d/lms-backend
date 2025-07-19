import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import Wishlist from '../models/Wishlist'

const router = express.Router()

// Add to Wishlist
router.post(
    '/',
    auth(['student', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const { book } = req.body
            const userId = (req as any).user._id

            const exists = await Wishlist.findOne({ user: userId, book })
            if (exists) {
                res.status(409).json({ message: 'Already in wishlist' })
                return
            }

            const entry = await Wishlist.create({ user: userId, book })
            res.status(201).json({ message: 'Book added to wishlist', entry })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Get Wishlist of Current User
router.get(
    '/',
    auth(['student', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user._id
            const list = await Wishlist.find({ user: userId }).populate('book')
            res.status(200).json(list)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Remove from Wishlist
router.delete(
    '/:bookId',
    auth(['student', 'admin']),
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user._id
            const bookId = req.params.bookId

            await Wishlist.findOneAndDelete({ user: userId, book: bookId })

            res.status(200).json({ message: 'Book removed from wishlist' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
