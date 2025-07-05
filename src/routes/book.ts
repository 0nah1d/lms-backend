import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import Book from '../models/Book'
import Department from '../models/Department'
import { paginate } from '../utils/paginate'
import { bookSchema } from '../validators/bookValidator'
import validate from '../middleware/validate'
import { saveBase64Image } from '../utils/saveBase64Image'
import { buildAbsoluteUrl } from '../utils/buildAbsoluteUrl'

const router = express.Router()

// Get all books
router.get('/', async (req: Request, res: Response) => {
    try {
        const { search, department, page = '1', limit = '10' } = req.query

        const currentPage = parseInt(page as string, 10)
        const perPage = parseInt(limit as string, 10)

        const query: any = {}

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { genre: { $regex: search, $options: 'i' } },
            ]
        }

        if (department) {
            const dept = await Department.findOne({ name: department })
            if (dept) {
                query.department = dept._id
            } else {
                res.status(404).json({ message: 'Department not found' })
                return
            }
        }

        const result = await paginate({
            model: Book,
            query,
            page: currentPage,
            limit: perPage,
            populate: ['category', 'department'],
            baseUrl: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
            originalQuery: req.query,
        })

        res.json(result)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Get a single book by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id).populate(
            'category department'
        )
        if (!book) {
            res.status(404).json({ message: 'Book not found' })
            return
        }
        res.json(book)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Create a book
router.post(
    '/',
    auth(['admin']),
    validate(bookSchema),
    async (req: Request, res: Response) => {
        try {
            const {
                title,
                author,
                genre,
                description,
                book_link,
                category,
                department,
                image,
            } = req.body

            const existingBook = await Book.findOne({
                title: { $regex: new RegExp(`^${title}$`, 'i') },
            })
            if (existingBook) {
                res.status(409).json({ title: 'Book title already exists' })
                return
            }

            // Handle base64 image
            let imageUrl = null
            if (image && image.startsWith('data:')) {
                const relativePath = saveBase64Image(image, 'book', 'bookImage')
                imageUrl = buildAbsoluteUrl(req, relativePath)
            } else if (image) {
                imageUrl = image
            }

            const book = new Book({
                title,
                author,
                genre,
                image: imageUrl,
                description,
                book_link,
                category,
                department,
            })

            await book.save()
            res.status(201).json({ message: 'Book created successfully', book })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Update a book
router.put(
    '/:id',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { title, image } = req.body

            if (title) {
                const existingBook = await Book.findOne({
                    _id: { $ne: req.params.id },
                    title: { $regex: new RegExp(`^${title}$`, 'i') },
                })
                if (existingBook) {
                    res.status(409).json({ title: 'Book title already exists' })
                    return
                }
            }

            // Handle base64 image if updated
            if (image && image.startsWith('data:')) {
                const relativePath = saveBase64Image(image, 'book', 'bookImage')
                req.body.image = buildAbsoluteUrl(req, relativePath)
            }

            const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })

            if (!book) {
                res.status(404).json({ message: 'Book not found' })
                return
            }

            res.json({ message: 'Book updated successfully', book })
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
            res.json({ message: 'Book deleted successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
