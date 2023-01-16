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

module.exports = router
