const app = require('./app')

const init = async () => {
  try {
    app.listen(3001, () => {
      // eslint-disable-next-line no-console
      console.log('Express App Listening on Port 3001')
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}

init()
