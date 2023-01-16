const router = require('express').Router()
const { getProfile } = require('../middleware/getProfile')
const capitalize = require('../utils/capitalize')

/*
* @api {get} /contracts/:id Retrieve a specific owned contract
* @apiName RetrieveContracts
* @apiGroup Contracts
* @apiPermission authenticated user
* @apiHeader {String} profile_id User profile_id.
* @apiSuccess {Object[]} contracts List of contracts belonging to the user.
* @apiError 401 Authenticated access only.
* @apiError 404 No contract found.
*/
router.get('/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { type, id: profileId } = req.profile
  const { id } = req.params

  const contract = await Contract.scope('active').findOne({
    attributes: { exclude: ['ClientId', 'ContractorId'] },
    where: { [`${capitalize(type)}Id`]: profileId, id },
  })

  if (!contract) return res.status(404).end()
  res.json(contract)
})

/*
* @api {get} /contracts/:id Retrieve all owned contracts
* @apiName RetrieveContract
* @apiGroup Contracts
* @apiPermission authenticated user
* @apiHeader {String} profile_id User profile_id.
* @apiSuccess {Object[]} contracts List of contracts belonging to the user.
* @apiError 401 Authenticated access only.
*/
router.get('/', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { type, id } = req.profile

  const contracts = await Contract.scope('active').findAll({
    attributes: { exclude: ['ClientId', 'ContractorId'] },
    where: { [`${capitalize(type)}Id`]: id },
  })
  res.json(contracts)
})

module.exports = router
