import { Request, Response, Router } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Library Management System',
        version: '1.0.0',
        author: 'Mst Humaira',
    })
})

export default router
