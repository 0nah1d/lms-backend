require('dotenv').config()
const cors = require('cors')
const express = require('express')
const connectDB = require('./config/db')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const chalk = require('chalk')

const app = express()
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
)

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json())

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Routes
app.use('/', require('./routes/home'))
app.use('/auth', require('./routes/auth'))
app.use('/categories', require('./routes/categories'))
app.use('/departments', require('./routes/departments'))
app.use('/books', require('./routes/book'))
app.use('/issues', require('./routes/issues'))

const PORT = process.env.PORT
app.listen(PORT, () =>
    console.log('Server running on ' + chalk.blue(`http://localhost:${PORT}`))
)
