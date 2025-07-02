const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const auth = require('../middleware/auth')

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new category
router.post('/', auth(['admin']), async (req, res) => {
    const { name, description } = req.body
    try {
        const category = new Category({ name, description })
        await category.save()
        res.status(201).json(category)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update a category
router.put('/:id', auth(['admin']), async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!category)
            return res.status(404).json({ message: 'Category not found' })
        res.json(category)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a category
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category)
            return res.status(404).json({ message: 'Category not found' })
        res.json({ message: 'Category deleted' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
