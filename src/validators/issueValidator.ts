import Joi from 'joi'

const issueSchema = Joi.object({
    book: Joi.string().required().messages({
        'string.empty': 'Book is required',
    }),
    user: Joi.string().required().messages({
        'string.empty': 'User is required',
    }),
    issue_date: Joi.date().required().messages({
        'date.base': 'Issue date is required',
    }),
    return_date: Joi.date().messages({
        'date.base': 'Return date is required',
    }),
    status: Joi.string()
        .valid('pending', 'approved', 'returned')
        .required()
        .messages({
            'any.only': 'Status must be either pending, approved, or returned',
        }),
})

export default issueSchema
