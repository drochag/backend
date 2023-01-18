const router = require('express').Router()
const admin = require('./admin')
const balances = require('./balances')
const contract = require('./contract')
const job = require('./job')

router.use('/admin', admin)
router.use('/balances', balances)
router.use('/contracts', contract)
router.use('/job', job)

module.exports = router
