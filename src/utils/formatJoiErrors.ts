import { ValidationError } from 'joi'

interface FormattedErrors {
    [key: string]: string
}

const formatJoiErrors = (
    error: ValidationError | undefined | null
): FormattedErrors | null => {
    if (!error || !error.details) return null

    return error.details.reduce<FormattedErrors>((acc, curr) => {
        const field = String(curr.path[0])
        const message = curr.message.replace(/['"]/g, '')
        acc[field] = message.charAt(0).toUpperCase() + message.slice(1)
        return acc
    }, {})
}

export default formatJoiErrors
