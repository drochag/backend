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

test('GET /contracts 200 | contractor', async () => {
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

test('GET /contracts/:id 200 | client', async () => {
  const { status, body } = await request(app())
    .get('/2')
    .set('profile_id', 1)

  const contracts = await Contract.scope('active').findOne({
    where: { ClientId: 1, id: 2 },
  })

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(contracts.id)
})

test('GET /contracts/:id 200 | contractor', async () => {
  const { status, body } = await request(app())
    .get('/2')
    .set('profile_id', 6)

  const contracts = await Contract.scope('active').findOne({
    where: { ContractorId: 6, id: 2 },
  })

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(contracts.id)
})

test('GET /contracts/:id 404 | not owned contract | client', async () => {
  const { status } = await request(app())
    .get('/2')
    .set('profile_id', 2)

  expect(status).toBe(404)
})

test('GET /contracts/:id 404 | not owned contract | contractor', async () => {
  const { status } = await request(app())
    .get('/2')
    .set('profile_id', 7)

  expect(status).toBe(404)
})
