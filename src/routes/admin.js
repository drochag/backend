const { Op } = require('sequelize')
const router = require('express').Router()

/**
* @api {get} /admin/best-profession Returns the profession that earned the most money
* @apiName BestProfession
* @apiGroup Admin
* @apiError 404 No paid jobs found.
* @apiSuccess {String} profession Profession that earned the most money.
* @apiQuery {Date} start Start date to filter the paid jobs. Defaults to start of the century.
* @apiQuery {Date} end End date to filter the paid jobs. Defaults to today.
*/
router.get('/best-profession', async (req, res) => {
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
})

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
router.get('/best-clients', async (req, res) => {
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
})

module.exports = router
