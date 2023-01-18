const router = require('express').Router()
const { bestProfession, bestClients } = require('../controllers/admin')

/**
* @api {get} /admin/best-profession Returns the profession that earned the most money
* @apiName BestProfession
* @apiGroup Admin
* @apiError 404 No paid jobs found.
* @apiSuccess {String} profession Profession that earned the most money.
* @apiQuery {Date} start Start date to filter the paid jobs. Defaults to start of the century.
* @apiQuery {Date} end End date to filter the paid jobs. Defaults to today.
*/
router.get('/best-profession', bestProfession)

/**
* @api {get} /admin/best-clients Returns the clients the paid the most for jobs
* @apiName BestClients
* @apiGroup Admin
* @apiError 404 No paid jobs found.
* @apiSuccess {Object[]} clients Client that paid the most money.
* @apiSuccess {Number} clients.id Client id.
* @apiSuccess {String} clients.fullName Client full name.
* @apiSuccess {Number} clients.paid Total paid by the client.
* @apiQuery {Date} start Start date to filter the paid jobs. Defaults to start of the century.
* @apiQuery {Date} end End date to filter the paid jobs. Defaults to today.
* @apiQuery {Number} [limit=2] Number of clients to return.
*/
router.get('/best-clients', bestClients)

module.exports = router
