const router = require('express').Router()
const contract = require('./contract')

router.use('/contract', contract)

module.exports = router
