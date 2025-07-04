import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import validate from '../middleware/validate'
import User from '../models/User'
import { registerSchema } from '../validators/userValidator'

const router = express.Router()

interface RegisterRequestBody {
    username: string
    email: string
    password: string
    confirm_password: string
}

interface LoginRequestBody {
    username_or_email: string
    password: string
}

router.post(
    '/register',
    validate(registerSchema),
    async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
        const { username, email, password } = req.body

        try {
            const existingUser = await User.findOne({
                $or: [{ email }, { username }],
            })

            if (existingUser) {
                const errors: Partial<Record<'email' | 'username', string>> = {}
                if (existingUser.email === email) {
                    errors.email = 'Email already exists'
                }
                if (existingUser.username === username) {
                    errors.username = 'Username already exists'
                }
                res.status(400).json(errors)
                return
            }

            const newUser = new User({
                username,
                email,
                password,
                role: 'student',
            })
            await newUser.save()

            res.status(201).json({ message: 'User created successfully.' })
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
)

router.post(
    '/login',
    async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
        const { username_or_email, password } = req.body

        try {
            const user = await User.findOne({
                $or: [
                    { username: username_or_email },
                    { email: username_or_email },
                ],
            })

            if (!user || !(await user.comparePassword(password))) {
                res.status(401).json({
                    password: 'Invalid username/email or password.',
                })
                return
            }

            if (!process.env.JWT_SECRET) {
                res.status(500).json({ message: 'JWT secret not configured' })
                return
            }

            const token = jwt.sign(
                { id: user._id, role: user.role, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.json({
                user: {
                    accessToken: token,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                message: 'Login successful.',
            })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
)

export default router
