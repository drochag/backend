const request = require('supertest')
const express = require('../services/express')
const routes = require('./balances')

const app = () => express(routes)

beforeEach(async () => {
})

test('POST /balances/deposit/1 200', async () => {
  const { status, body } = await request(app())
    .post('/deposit/1')
    .send({ amount: 50 })

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.balance).toBe(1200)
})

test('POST /balances/deposit/1 409', async () => {
  const { status, body } = await request(app())
    .post('/deposit/1')
    .send({ amount: 500 })

  expect(status).toBe(409)
  expect(body.error).toBe('A client cannot deposit more than 25% his total of jobs to pay.')
})
