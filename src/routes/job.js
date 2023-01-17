/* eslint-disable camelcase */
const router = require('express').Router()
const { getProfile } = require('../middleware/getProfile')
const capitalize = require('../utils/capitalize')

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
router.get('/unpaid', getProfile, async (req, res) => {
  const { Contract, Job } = req.app.get('models')
  const { type, id } = req.profile

  const contracts = await Contract.scope('active').findAll({
    attributes: { exclude: ['ClientId', 'ContractorId'] },
    where: { [`${capitalize(type)}Id`]: id },
    include: [{
      model: Job,
      as: 'Jobs',
      where: { paid: false },
      required: true,
    }],
  })
  if (!contracts.length) return res.status(404).end()
  res.json(contracts.map(contract => contract.Jobs).flat())
})

/**
 * @api {post} /:job_id/pay Pay a job
 * @apiName PayJob
 * @apiGroup Jobs
 * @apiPermission authenticated client
 * @apiHeader {String} profile_id Client profile_id.
 * @apiParam {String} job_id Job id.
 * @apiSuccess (Sucess 201) {Object} job Job data.
 * @apiError 401 Authenticated access only.
 * @apiError 405 Only clients can pay for a job.
 * @apiError 404 Job not found.
 */
router.post('/:job_id/pay', getProfile, async (req, res) => {
  const { Job, Contract, Profile } = req.app.get('models')
  const { id, type } = req.profile
  const { job_id } = req.params

  if (type !== 'client') return res.status(405).end()

  const job = await Job.findOne({
    where: { id: job_id },
    include: [{
      model: Contract,
      as: 'Contract',
      where: { ClientId: id },
      required: true,
      include: [{
        model: Profile,
        as: 'Contractor',
      }, {
        model: Profile,
        as: 'Client',
      }],
    }],
  })

  if (!job) return res.status(404).end()
  if (job.paid) return res.status(409).send({ error: 'Job already paid' })
  if (job.Contract.Client.balance < job.price) return res.status(402).end()

  job.paid = true
  job.paymentDate = new Date()
  job.Contract.Client.balance -= job.price
  job.Contract.Contractor.balance += job.price

  await Promise.all([
    job.Contract.Client.save(),
    job.Contract.Contractor.save(),
    job.save(),
  ])
    .then(() => {
      res.status(200).json(job)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
})

module.exports = router
