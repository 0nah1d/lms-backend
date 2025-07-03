"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Department_1 = __importDefault(require("../models/Department"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department_1.default.find();
        res.json(departments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Create a new department
router.post('/', (0, auth_1.default)(['admin']), async (req, res) => {
    const { name, description } = req.body;
    try {
        const department = new Department_1.default({ name, description });
        await department.save();
        res.status(201).json(department);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a department
router.put('/:id', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const department = await Department_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!department) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        res.json(department);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete a department
router.delete('/:id', (0, auth_1.default)(['admin']), async (req, res) => {
    try {
        const department = await Department_1.default.findByIdAndDelete(req.params.id);
        if (!department) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        res.json({ message: 'Department deleted' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.default = router;
