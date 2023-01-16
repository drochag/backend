const express = require('express')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { sequelize } = require('../model')

module.exports = routes => {
  const app = express()

  if (['production', 'development'].includes(process.env.NODE_ENV)) {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.set('sequelize', sequelize)
  app.set('models', sequelize.models)
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use(routes)

  return app
}
