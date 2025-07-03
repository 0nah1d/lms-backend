import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface AuthRequest extends Request {
    user?: JwtPayload | string
}

const auth = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        const token = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            res.status(401).json({ message: 'No token provided' })
            return // exit middleware, no return value
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
            req.user = decoded

            if (
                roles.length &&
                typeof decoded === 'object' &&
                !roles.includes(decoded.role)
            ) {
                res.status(403).json({ message: 'Access denied' })
                return
            }

            next()
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' })
            return
        }
    }
}

export default auth
