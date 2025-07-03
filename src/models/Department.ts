import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IDepartment extends Document {
    name: string
    description?: string
}

const departmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
})

const Department: Model<IDepartment> = mongoose.model<IDepartment>(
    'Department',
    departmentSchema
)

export default Department
