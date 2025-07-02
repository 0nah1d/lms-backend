function formatJoiErrors(error) {
    if (!error || !error.details) return null;

    return error.details.reduce((acc, curr) => {
        const field = curr.path[0];
        let message = curr.message.replace(/['"]/g, '');

        if (message.toLowerCase().startsWith(field.toLowerCase())) {
            message = message.slice(field.length).trim();
        }

        acc[field] = message.charAt(0).toUpperCase() + message.slice(1);
        return acc;
    }, {});
}

module.exports = formatJoiErrors;
