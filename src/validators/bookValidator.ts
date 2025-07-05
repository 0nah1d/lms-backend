import Joi from 'joi'

export const bookSchema = Joi.object({
    title: Joi.string().min(5).required().messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 5 characters long',
    }),
    author: Joi.string().min(3).required().messages({
        'string.empty': 'Author is required',
        'string.min': 'Author must be at least 3 characters long',
    }),
    genre: Joi.string().min(3).required().messages({
        'string.empty': 'Genre is required',
        'string.min': 'Genre must be at least 3 characters long',
    }),
    image: Joi.string().optional(),
    description: Joi.string().optional(),
    book_link: Joi.string().optional(),
    category: Joi.string().required().messages({
        'string.empty': 'Category is required',
    }),
    department: Joi.string().required().messages({
        'string.empty': 'Department is required',
    }),
})
