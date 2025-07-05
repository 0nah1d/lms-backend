import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IIssue extends Document {
    book: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    issue_date: Date
    return_date?: Date
    status: 'pending' | 'approved' | 'returned'
}

const issueSchema = new Schema<IIssue>({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issue_date: { type: Date, default: Date.now },
    return_date: { type: Date },
    status: {
        type: String,
        enum: ['pending', 'approved', 'returned'],
        default: 'pending',
        required: true,
    },
})

const Issue: Model<IIssue> = mongoose.model<IIssue>('Issue', issueSchema)

export default Issue
