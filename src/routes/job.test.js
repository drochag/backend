const request = require('supertest')
const express = require('../services/express')
const routes = require('./job')
const { Contract, Job, Profile } = require('../model')

const app = () => express(routes)

beforeEach(async () => {
})

test('GET /jobs/unpaid 401 (not signed in)', async () => {
  const { status } = await request(app())
    .get('/unpaid')

  expect(status).toBe(401)
})

test('GET /jobs/unpaid 200 | client', async () => {
  const { status, body } = await request(app())
    .get('/unpaid')
    .set('profile_id', 1)

  const contracts = await Contract.scope('active').findAll({
    where: { ClientId: 1 },
    include: [{
      model: Job,
      as: 'Jobs',
      where: { paid: false },
      required: true,
    }],
  })

  const jobs = contracts.map(contract => contract.Jobs).flat()

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(jobs.length)
  expect(typeof body[0]).toBe('object')
  expect(body[0].id).toBe(jobs[0].id)
})

test('GET /jobs/unpaid 200 | contractor', async () => {
  const { status, body } = await request(app())
    .get('/unpaid')
    .set('profile_id', 6)

  const contracts = await Contract.scope('active').findAll({
    where: { ContractorId: 6 },
    include: [{
      model: Job,
      as: 'Jobs',
      where: { paid: false },
      required: true,
    }],
  })

  const jobs = contracts.map(contract => contract.Jobs).flat()

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(jobs.length)
  expect(typeof body[0]).toBe('object')
  expect(body[0].id).toBe(jobs[0].id)
})

test('POST /jobs/1/pay 200 | client', async () => {
  const { status, body } = await request(app())
    .post('/1/pay')
    .set('profile_id', 1)

  const job = await Job.findOne({
    where: { id: 1 },
    include: [{
      model: Contract,
      as: 'Contract',
      where: { ClientId: 1 },
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

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.paid).toBe(true)
  expect(job.Contract.Client.balance).toBe(950)
  expect(job.Contract.Contractor.balance).toBe(264)
})

test('POST /jobs/1/pay 405 | contractor -- a contractor cannot pay', async () => {
  const { status } = await request(app())
    .post('/1/pay')
    .set('profile_id', 5)

  expect(status).toBe(405)
})

test('POST /jobs/1/pay 409 | client -- already paid', async () => {
  const { status } = await request(app())
    .post('/1/pay')
    .set('profile_id', 1)

  expect(status).toBe(409)
})

test('POST /jobs/5/pay 402 | client -- not enough balance', async () => {
  const { status } = await request(app())
    .post('/5/pay')
    .set('profile_id', 4)

  expect(status).toBe(402)
})
