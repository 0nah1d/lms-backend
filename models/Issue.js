const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: {
        type: String,
        enum: ['pending', 'approved', 'returned'],
        default: 'pending',
        required: true,
    },
})

module.exports = mongoose.model('Issue', issueSchema)
