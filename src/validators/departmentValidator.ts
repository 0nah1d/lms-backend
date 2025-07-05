import Joi from 'joi'

const departmentSchema = Joi.object({
    name: Joi.string().min(2).required().messages({
        'string.empty': 'Department name is required',
        'string.min': 'Department name must be at least 2 characters long',
    }),
    description: Joi.string().allow('').optional(),
})

export default departmentSchema
