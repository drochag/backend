const router = require('express').Router()
const contract = require('./contract')
const job = require('./job')
const balances = require('./balances')

router.use('/contract', contract)
router.use('/job', job)
router.use('/balances', balances)

module.exports = router
