const router = require('express').Router()

router.get('/', (req, res) => {
    res.send({
        message: 'Library Management System',
        version: '1.0.0',
        author: 'Mst Humaira',
    })
})
module.exports = router
