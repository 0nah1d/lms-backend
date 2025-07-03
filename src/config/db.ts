import mongoose from 'mongoose'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log(chalk.green('✓ MongoDB is connected'))
    } catch (error: any) {
        console.error(
            chalk.red(`✗ Failed to connect to MongoDB: ${error.message}`)
        )
        process.exit(1)
    }
}

export default connectDB
