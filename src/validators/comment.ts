import Joi from 'joi'

export const commentSchema = Joi.object({
    book: Joi.string().required().messages({
        'any.required': 'Book ID is required',
        'string.empty': 'Book ID cannot be empty',
    }),
    text: Joi.string().min(2).required().messages({
        'any.required': 'Comment text is required',
        'string.empty': 'Comment text cannot be empty',
        'string.min': 'Comment text must be at least 2 characters long',
    }),
})
