const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student',
        required: true,
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    batch: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
})

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 12)
        } catch (error) {
            return next(error)
        }
    }
    next()
})

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new Error('Password is incorrect.')
    }
}

module.exports = mongoose.model('User', userSchema)
