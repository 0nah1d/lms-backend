import { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'
import formatJoiErrors from '../utils/formatJoiErrors'

const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
        })

        if (error) {
            const formatted = formatJoiErrors(error)
            res.status(400).json(formatted)
            return
        }

        ;(req as any).validated = value
        next()
    }
}

export default validate
