const Joi = require('joi')

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(128).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password does not match',
    }),
    role: Joi.string().valid('student', 'admin').default('student'),
    department: Joi.string().optional(),
    batch: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zip: Joi.string().optional(),
})

module.exports = {
    registerSchema,
}
