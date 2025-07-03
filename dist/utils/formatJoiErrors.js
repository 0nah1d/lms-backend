"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatJoiErrors = (error) => {
    if (!error || !error.details)
        return null;
    return error.details.reduce((acc, curr) => {
        const field = String(curr.path[0]);
        let message = curr.message.replace(/['"]/g, '');
        if (message.toLowerCase().startsWith(field.toLowerCase())) {
            message = message.slice(field.length).trim();
        }
        acc[field] = message.charAt(0).toUpperCase() + message.slice(1);
        return acc;
    }, {});
};
exports.default = formatJoiErrors;
