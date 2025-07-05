import express, { Request, Response } from 'express'
import auth from '../middleware/auth'
import validate from '../middleware/validate'
import Department, { IDepartment } from '../models/Department'
import departmentSchema from '../validators/departmentValidator'

const router = express.Router()

// Get all departments
router.get('/', async (req: Request, res: Response) => {
    try {
        const departments = await Department.find().sort({ _id: -1 })
        res.json(departments)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new department
router.post(
    '/',
    auth(['admin']),
    validate(departmentSchema),
    async (req: Request, res: Response) => {
        const { name, description } = req.body
        try {
            const existingDepartment = await Department.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
            })
            if (existingDepartment) {
                res.status(409).json({
                    name: 'Department name already exists',
                })
                return
            }

            const department = new Department({ name, description })
            await department.save()
            res.status(201).json({ message: 'Department created successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Update a department
router.patch(
    '/:id',
    auth(['admin']),
    validate(departmentSchema),
    async (
        req: Request<{ id: string }, {}, Partial<IDepartment>>,
        res: Response
    ) => {
        try {
            const { name } = req.body

            if (name) {
                const existingDepartment = await Department.findOne({
                    _id: { $ne: req.params.id },
                    name: { $regex: new RegExp(`^${name}$`, 'i') },
                })
                if (existingDepartment) {
                    res.status(409).json({
                        name: 'Department name already exists',
                    })
                    return
                }
            }

            const department = await Department.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            )
            if (!department) {
                res.status(404).json({ message: 'Department not found' })
                return
            }

            res.json({ message: 'Department updated successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

// Delete a department
router.delete(
    '/:id',
    auth(['admin']),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const department = await Department.findByIdAndDelete(req.params.id)
            if (!department) {
                res.status(404).json({ message: 'Department not found' })
                return
            }
            res.json({ message: 'Department deleted successfully' })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
