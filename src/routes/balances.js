const router = require('express').Router()

const { deposit } = require('../controllers/balances')

/**
* @api {post} /balances/deposit/:userId Deposit money into the balance of a client
* @apiName BalanceDeposit
* @apiGroup Balances
* @apiError 404 No unpaid jobs found.
* @apiError 409 A client can't deposit more than 25% his total of jobs to pay.
* @apiParam {Number} userId User id.
* @apiBody {Number} amount Amount to deposit.
* @apiSuccess {Number} balance Current balance of the client.
*/
router.post('/deposit/:userId', deposit)

module.exports = router
