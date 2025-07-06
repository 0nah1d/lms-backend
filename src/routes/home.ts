import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Library Management System',
        version: '1.0.0',
        author: 'Mst Humaira',
    })
})

router.get('/check-token', (req: Request, res: Response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        res.status(401).json({ message: 'Unauthorized access' })
        return
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET as string)
        res.status(200).json({ message: 'Token is valid' })
        return
    } catch {
        res.status(401).json({ message: 'Invalid token' })
        return
    }
})

export default router
