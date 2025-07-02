const express = require('express')
const router = express.Router()
const Department = require('../models/Department')
const auth = require('../middleware/auth')

// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find()
        res.json(departments)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new department
router.post('/', auth(['admin']), async (req, res) => {
    const { name, description } = req.body
    try {
        const department = new Department({ name, description })
        await department.save()
        res.status(201).json(department)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update a department
router.put('/:id', auth(['admin']), async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!department)
            return res.status(404).json({ message: 'Department not found' })
        res.json(department)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a department
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id)
        if (!department)
            return res.status(404).json({ message: 'Department not found' })
        res.json({ message: 'Department deleted' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
