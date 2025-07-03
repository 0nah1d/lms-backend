import express, { Request, Response } from 'express'
import Category, { ICategory } from '../models/Category'
import auth from '../middleware/auth'

const router = express.Router()

// Get all categories
router.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new category
router.post(
    '/',
    auth(['admin']),
    async (
        req: Request<{}, {}, { name: string; description?: string }>,
        res: Response
    ) => {
        const { name, description } = req.body
        try {
            const category = new Category({ name, description })
            await category.save()
            res.status(201).json(category)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Update a category
router.put(
    '/:id',
    auth(['admin']),
    async (
        req: Request<{ id: string }, {}, Partial<ICategory>>,
        res: Response
    ) => {
        try {
            const category = await Category.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            )
            if (!category) {
                res.status(404).json({ message: 'Category not found' })
                return
            }
            res.json(category)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Delete a category
router.delete(
    '/:id',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id)
            if (!category) {
                res.status(404).json({ message: 'Category not found' })
                return
            }
            res.json({ message: 'Category deleted' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
