import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import chalk from 'chalk'
import path from 'path'

import connectDB from './config/db'
import router from './routes'

dotenv.config()

const app = express()

void connectDB()

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
)
app.use(express.json())
app.use(morgan('dev'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/', router)

const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, () => {
    console.log(`Server running at ${chalk.blue(`http://localhost:${PORT}`)}`)
})
