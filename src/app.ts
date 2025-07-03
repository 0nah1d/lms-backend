import dotenv from 'dotenv'
import cors from 'cors'
import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import chalk from 'chalk'
import connectDB from './config/db'
import { generateSwaggerDocsOnce } from './config/swagger'

dotenv.config()

const app: Application = express()

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
)

// Connect to MongoDB
connectDB().then()

// JSON body parser
app.use(express.json())

generateSwaggerDocsOnce().then(() => {
    const swaggerDocument = require('../swagger.json')

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    // API Routes
    app.use('/', require('./routes/home').default)
    app.use('/auth', require('./routes/auth').default)
    app.use('/categories', require('./routes/categories').default)
    app.use('/departments', require('./routes/departments').default)
    app.use('/books', require('./routes/book').default)
    app.use('/issues', require('./routes/issues').default)

    // Start server
    const PORT: number = Number(process.env.PORT) || 5000
    app.listen(PORT, () =>
        console.log(
            'Server running on ' + chalk.blue(`http://localhost:${PORT}`)
        )
    )
})
