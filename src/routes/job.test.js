const request = require('supertest')
const express = require('../services/express')
const routes = require('./job')
const { Contract, Job } = require('../model')

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
