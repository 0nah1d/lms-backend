const mongoose = require('mongoose')
const chalk = require('chalk')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(
            chalk.green(
                '✓ MongoDB connected on ' + chalk.blue(process.env.MONGODB_URI)
            )
        )
    } catch (error) {
        console.error(
            chalk.red('✗ Failed to connect to MongoDB:', error.message)
        )
        process.exit(1)
    }
}

module.exports = connectDB
