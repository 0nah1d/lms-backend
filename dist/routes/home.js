"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send({
        message: 'Library Management System',
        version: '1.0.0',
        author: 'Mst Humaira',
    });
});
exports.default = router;
