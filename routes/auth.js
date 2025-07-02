const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const validate = require('../middleware/validate')
const { registerSchema } = require('../validators/userValidator')

router.post('/register', validate(registerSchema), async (req, res) => {
    const { username, email, password, confirm_password } = req.body
    if (password !== confirm_password) {
        return res
            .status(400)
            .json({ password: 'Password and confirm password do not match' })
    }
    try {
        const user = new User({ username, email, password, role: 'student' })
        await user.save()
        res.status(201).json({ message: 'Student created successfully.' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (!user || !(await user.comparePassword(password))) {
            return res
                .status(401)
                .json({ password: 'Invalid username or password.' })
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.json({ token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
