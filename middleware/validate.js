const formatJoiErrors = require('../utils/formatJoiErrors')

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })

    if (error) {
        const formatted = formatJoiErrors(error)
        return res.status(400).json(formatted)
    }

    req.validated = value
    next()
}

module.exports = validate
