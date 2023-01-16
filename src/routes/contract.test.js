const request = require('supertest')
const express = require('../services/express')
const routes = require('./contract')
const { Contract } = require('../model')

const app = () => express(routes)

beforeEach(async () => {
})

test('GET /contracts 401 (not signed in)', async () => {
  const { status } = await request(app())
    .get('/')

  expect(status).toBe(401)
})

test('GET /contracts 200 | client', async () => {
  const { status, body } = await request(app())
    .get('/')
    .set('profile_id', 1)

  const contracts = await Contract.scope('active').findAll({
    where: { ClientId: 1 },
  })

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(contracts.length)
  expect(typeof body[0]).toBe('object')
  expect(body[0].id).toBe(contracts[0].id)
})

test('GET /contracts 200 | client', async () => {
  const { status, body } = await request(app())
    .get('/')
    .set('profile_id', 6)

  const contracts = await Contract.scope('active').findAll({
    where: { ContractorId: 6 },
  })

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(contracts.length)
  expect(typeof body[0]).toBe('object')
  expect(body[0].id).toBe(contracts[0].id)
})
