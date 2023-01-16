const express = require('./services/express')
const routes = require('./routes')

const app = express(routes)

module.exports = app
