import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId
    book: mongoose.Types.ObjectId
    createdAt: Date
}

const wishlistSchema = new Schema<IWishlist>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    createdAt: { type: Date, default: Date.now },
})

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>(
    'Wishlist',
    wishlistSchema
)

export default Wishlist
