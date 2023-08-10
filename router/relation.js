const express = require('express')
const controller = require('../controllers/relation')
const router = express.Router()

router.post('/', controller.relationPostAuthor)

module.exports = router
