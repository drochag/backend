/* eslint-disable camelcase */
const router = require('express').Router()
const { unpaid, pay } = require('../controllers/job')
const { getProfile } = require('../middleware/getProfile')

/**
* @api {get} /jobs/unpaid Retrieve all unpaid jobs for a user on active contracts
* @apiName RetrieveUnpaidJobs
* @apiGroup Jobs
* @apiPermission authenticated user
* @apiHeader {String} profile_id User profile_id.
* @apiSuccess {Object[]} jobs List of unpaid jobs on active contracts belonging to the user.
* @apiError 401 Authenticated access only.
* @apiError 404 No active contracts found.
*/
router.get('/unpaid', getProfile, unpaid)

/**
 * @api {post} /:job_id/pay Pay a job
 * @apiName PayJob
 * @apiGroup Jobs
 * @apiPermission authenticated client
 * @apiHeader {String} profile_id Client profile_id.
 * @apiParam {String} job_id Job id.
 * @apiSuccess (Sucess 201) {Object} job Job data.
 * @apiError 401 Authenticated access only.
 * @apiError 402 Insufficient funds.
 * @apiError 404 Job not found (or job doesn't belong to a contract owned by the client).
 * @apiError 405 Only clients can pay for a job.
 * @apiError 409 Job already paid.
 */
router.post('/:job_id/pay', getProfile, pay)

module.exports = router
