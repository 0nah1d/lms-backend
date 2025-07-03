import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IBook extends Document {
    title: string
    author: string
    category: mongoose.Types.ObjectId
    department: mongoose.Types.ObjectId
    stock: number
}

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    stock: { type: Number, default: 0 },
})

const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema)

export default Book
