const Joi = require('joi')

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be less than 30 characters long',
        'string.empty': 'Username is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(8).max(25).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be less than 25 characters long',
        'string.empty': 'Password is required',
    }),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Confirm password does not match',
            'string.empty': 'Confirm password is required',
        }),
    role: Joi.string().valid('student', 'admin').default('student'),
})

module.exports = {
    registerSchema,
}
