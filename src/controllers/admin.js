const { Op } = require('sequelize')

const bestProfession = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const { start = new Date('2000'), end = new Date() } = req.query

  const bestPaidProfession = await Profile.findAll({
    attributes: ['profession', [sequelize.fn('sum', sequelize.col('price')), 'earned']],
    include: [{
      model: Contract,
      as: 'Contractor',
      attributes: [],
      required: true,
      include: [{
        model: Job,
        required: true,
        attributes: [],
        where: {
          paid: true,
          paymentDate: {
            [Op.between]: [start, end],
          },
        },
      }],
    }],
    where: {
      type: 'contractor',
    },
    group: ['profession'],
    order: [[sequelize.col('earned'), 'DESC']],
    limit: 1,
    subQuery: false,
  })

  if (!bestPaidProfession) return res.status(404).send({ error: 'No paid jobs found.' })

  res.status(200).send({ profession: bestPaidProfession[0].profession })
}

const bestClients = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const { start = new Date('2000'), end = new Date(), limit = 2 } = req.query

  const paidJobsForPeriod = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end],
      },
    },
    include: [{
      model: Contract,
      include: [{
        model: Profile,
        as: 'Client',
        where: { type: 'client' },
        attributes: ['firstName', 'lastName'],
      }],
      attributes: ['ClientId'],
    }],
    group: 'Contract.ClientId',
    limit,
    subQuery: false,
  })

  if (!paidJobsForPeriod) return res.status(404).send({ error: 'No paid jobs found.' })

  const bestClient = paidJobsForPeriod.map(job => ({
    id: job.Contract.ClientId,
    fullName: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
    paid: job.dataValues.paid,
  }))

  res.status(200).send(bestClient)
}

module.exports = {
  bestProfession,
  bestClients,
}
