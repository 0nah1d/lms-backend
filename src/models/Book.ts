import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IBook extends Document {
    title: string
    author: string
    genre: string
    image: string
    description: string
    category: mongoose.Types.ObjectId
    department: mongoose.Types.ObjectId
    stock: number
}

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    image: { type: String },
    description: { type: String },
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
