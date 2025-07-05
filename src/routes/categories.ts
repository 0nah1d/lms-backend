import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import validate from '../middleware/validate'
import Category, { ICategory } from '../models/Category'
import { categorySchema } from '../validators/categoryValidator'

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
    validate(categorySchema),
    async (
        req: Request<{}, {}, { name: string; description?: string }>,
        res: Response
    ) => {
        const { name, description } = req.body
        try {
            const existingCategory = await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
            })
            if (existingCategory) {
                res.status(409).json({
                    message: 'Category name already exists',
                })
                return
            }

            const category = new Category({ name, description })
            await category.save()
            res.status(201).json({ message: 'Category created successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Update a category
router.put(
    '/:id',
    auth(['admin']),
    validate(categorySchema),
    async (
        req: Request<{ id: string }, {}, Partial<ICategory>>,
        res: Response
    ) => {
        try {
            const { name } = req.body

            if (name) {
                const existingCategory = await Category.findOne({
                    _id: { $ne: req.params.id },
                    name: { $regex: new RegExp(`^${name}$`, 'i') },
                })
                if (existingCategory) {
                    res.status(409).json({
                        message: 'Category name already exists',
                    })
                    return
                }
            }

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

            res.json({ message: 'Category updated successfully' })
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
            res.json({ message: 'Category deleted successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
