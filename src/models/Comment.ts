import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IComment extends Document {
    user: mongoose.Types.ObjectId
    book: mongoose.Types.ObjectId
    text: string
    createdAt: Date
}

const commentSchema = new Schema<IComment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const Comment: Model<IComment> = mongoose.model<IComment>(
    'Comment',
    commentSchema
)

export default Comment
