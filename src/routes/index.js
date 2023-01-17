const router = require('express').Router()
const contract = require('./contract')
const job = require('./job')

router.use('/contract', contract)
router.use('/job', job)

module.exports = router
