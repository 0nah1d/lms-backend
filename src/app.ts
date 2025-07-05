import chalk from 'chalk'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/db'

import authRoute from './routes/auth'
import bookRoute from './routes/book'
import categoryRoute from './routes/categories'
import departmentRoute from './routes/departments'
import homeRoute from './routes/home'
import issueRoute from './routes/issues'
import path from 'path'

dotenv.config()

const app: Application = express()

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
)

connectDB().then()

// Middleware
app.use(express.json())
app.use(morgan('dev'))

async function startServer() {
    try {
        const swaggerDocument = require('../swagger.json')

        // Swagger UI
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

        app.use('/', homeRoute)
        app.use('/auth', authRoute)
        app.use('/category', categoryRoute)
        app.use('/department', departmentRoute)
        app.use('/book', bookRoute)
        app.use('/issue', issueRoute)

        const PORT: number = Number(process.env.PORT) || 5000
        app.listen(PORT, () =>
            console.log(
                `Server running on ${chalk.blue(`http://localhost:${PORT}`)}`
            )
        )
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

void startServer()
