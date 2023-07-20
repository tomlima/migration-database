const express = require('express')
const controller = require('../controllers/migration')
const router = express.Router()

router.post('/', controller.migrate)

module.exports = router
