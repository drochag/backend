/* eslint-disable camelcase */
const capitalize = require('../utils/capitalize')

const unpaid = async (req, res) => {
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
  if (!contracts.length) return res.status(404).send({ error: 'No active contracts found.' })
  res.json(contracts.map(contract => contract.Jobs).flat())
}

const pay = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get('models')
  const { id, type } = req.profile
  const { job_id } = req.params

  if (type !== 'client') return res.status(405).send({ error: 'Only clients can pay for a job.' })

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

  if (!job) return res.status(404).send({ error: 'Job not found or don\t belong to client.' })
  if (job.Contract.Client.balance < job.price) return res.status(402).send({ error: 'Insufficient funds' })
  if (job.paid) return res.status(409).send({ error: 'Job already paid' })

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
}

module.exports = {
  unpaid,
  pay,
}
