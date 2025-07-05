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
    image_url: Joi.string().required().messages({
        'string.empty': 'Image is required',
    }),
    description: Joi.string().min(10).required().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters long',
    }),
    book_link: Joi.string().required().messages({
        'string.empty': 'Book link is required',
    }),
    department: Joi.string().required().messages({
        'string.empty': 'Department is required',
    }),
    stock: Joi.number().required().messages({
        'number.base': 'Stock must be a number',
        'any.required': 'Stock is required',
    })
})
