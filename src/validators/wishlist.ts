import Joi from 'joi'

export const wishlistSchema = Joi.object({
    book: Joi.string().required().messages({
        'any.required': 'Book ID is required',
        'string.empty': 'Book ID cannot be empty',
    }),
})
