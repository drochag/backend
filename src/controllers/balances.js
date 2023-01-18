const deposit = async (req, res) => {
  const { Job, Contract, Profile } = req.app.get('models')
  const { userId } = req.params
  const { amount } = req.body

  const jobs = await Job.findAll({
    where: { paid: false },
    include: [{
      model: Contract,
      as: 'Contract',
      where: { ClientId: userId },
      required: true,
    }],
  })

  if (jobs.length === 0) return res.status(404).send({ error: 'No unpaid jobs found.' })

  const client = await Profile.findOne({ where: { id: userId }})

  if (
    (jobs.reduce((acc, job) => acc + job.price, 0) - client.balance) * 0.25 < amount
  ) return res.status(409).send({ error: 'A client cannot deposit more than 25% his total of jobs to pay.' })

  client.balance += amount
  await client.save()

  res.status(200).send({ balance: client.balance })
}

module.exports = {
  deposit,
}
