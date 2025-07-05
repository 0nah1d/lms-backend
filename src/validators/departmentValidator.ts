import Joi from 'joi'

const departmentSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'Department name is required',
        'string.min': 'Department name must be at least 3 characters long',
    }),
    description: Joi.string().optional(),
})

export default departmentSchema
