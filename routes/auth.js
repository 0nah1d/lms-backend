const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const validate = require('../middleware/validate')
const { registerSchema } = require('../validators/userValidator')

router.post('/register', validate(registerSchema), async (req, res) => {
    const { username, email, password, confirm_password } = req.body

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        })

        if (existingUser) {
            const errors = {}
            if (existingUser.email === email) {
                errors.email = 'Email already exists'
            }
            if (existingUser.username === username) {
                errors.username = 'Username already exists'
            }
            return res.status(400).json(errors)
        }

        const newUser = new User({ username, email, password })
        await newUser.save()

        res.status(201).json({ message: 'User created successfully.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({
            $or: [{ username }, { email: username }],
        })

        if (!user || !(await user.comparePassword(password))) {
            return res
                .status(401)
                .json({ password: 'Invalid username/email or password.' })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
