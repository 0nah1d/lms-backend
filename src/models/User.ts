import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    name: string
    username: string
    email: string
    password: string
    role: 'admin' | 'student'
    department?: mongoose.Types.ObjectId
    batch?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zip?: string

    comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student',
        required: true,
    },
    name: { type: String },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    batch: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
})

// Encrypt password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 12)
        } catch (error) {
            return next(error as any)
        }
    }
    next()
})

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password)
    } catch {
        throw new Error('Password is incorrect.')
    }
}

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
