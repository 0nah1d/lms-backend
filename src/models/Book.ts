import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IBook extends Document {
    title: string
    author: string
    genre: string
    image_url: string
    description: string
    book_link: string
    department: mongoose.Types.ObjectId
    stock: number
}

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    image_url: { type: String },
    description: { type: String },
    book_link: { type: String},
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    stock: { type: Number, default: 0 },
})

const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema)

export default Book
