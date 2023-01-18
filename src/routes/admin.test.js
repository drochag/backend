const request = require('supertest')
const express = require('../services/express')
const routes = require('./admin')

const app = () => express(routes)

beforeEach(async () => {
})

test('GET /admin/best-profession 200', async () => {
  const { status, body } = await request(app())
    .get('/best-profession')

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.profession).toBe('Programmer')
})

test('GET /admin/best-profession?start=2020-08-17&end=2020-08-18 200', async () => {
  const { status, body } = await request(app())
    .get('/best-profession?start=2020-08-17&end=2020-08-18')

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.profession).toBe('Musician')
})

test('GET /admin/best-profession 200', async () => {
  const { status, body } = await request(app())
    .get('/best-profession')

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(false)
  expect(typeof body).toBe('object')
  expect(body.profession).toBe('Programmer')
})

test('GET /admin/best-clients 200', async () => {
  const { status, body } = await request(app())
    .get('/best-clients')

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body).toBe('object')
  expect(body.length).toBe(2)
  expect(body[0].fullName).toBe('Ash Kethcum') // lol this was on the seed
  expect(body[0].paid).toBe(2020)
})

test('GET /admin/best-clients?limit=10 200', async () => {
  const { status, body } = await request(app())
    .get('/best-clients?limit=10')

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body).toBe('object')
  expect(body.length).toBe(4)
})

test('GET /admin/best-clients?start=2020-08-17&end=2020-08-18 200', async () => {
  const { status, body } = await request(app())
    .get('/best-clients?start=2020-08-17&end=2020-08-18')

  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body).toBe('object')
  expect(body.length).toBe(2)

  expect(body[0].fullName).toBe('John Snow')
  expect(body[0].paid).toBe(200)
  expect(body[1].fullName).toBe('Harry Potter')
  expect(body[1].paid).toBe(200)
})
