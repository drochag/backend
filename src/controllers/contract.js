const capitalize = require('../utils/capitalize')

const get = async (req, res) => {
  const { Contract } = req.app.get('models')
  const { type, id: profileId } = req.profile
  const { id } = req.params

  const contract = await Contract.scope('active').findOne({
    attributes: { exclude: ['ClientId', 'ContractorId'] },
    where: { [`${capitalize(type)}Id`]: profileId, id },
  })

  if (!contract) return res.status(404).end()
  res.json(contract)
}

const index = async (req, res) => {
  const { Contract } = req.app.get('models')
  const { type, id } = req.profile

  const contracts = await Contract.scope('active').findAll({
    attributes: { exclude: ['ClientId', 'ContractorId'] },
    where: { [`${capitalize(type)}Id`]: id },
  })
  res.json(contracts)
}

module.exports = {
  get,
  index,
}
