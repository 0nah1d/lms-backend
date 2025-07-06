import Joi from 'joi'

const issueSchema = Joi.object({
    book: Joi.string().required().messages({
        'string.empty': 'Book is required',
    }),
    quantity: Joi.number().min(1).required().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required',
    }),
    user: Joi.string().optional(),
    issue_date: Joi.date().optional(),
    return_date: Joi.date().optional().messages({
        'date.base': 'Return date must be a valid date',
    }),
    status: Joi.string()
        .valid('pending', 'approved', 'returned')
        .optional()
        .messages({
            'any.only': 'Status must be either pending, approved, or returned',
        }),
})

export default issueSchema
