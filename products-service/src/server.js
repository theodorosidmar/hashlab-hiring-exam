const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const productRoutes = require('./product/route')
const httpStatus = require('./helpers/http-status')
const { log, logError } = require('./helpers/logger')

const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('port', process.env.PORT)

app.use((req, res, next) => {
  req.user = { id: req.headers['x-user-id'] }
  const data = {
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
  }
  log(data)
  return next()
})

app.use('/product', productRoutes)

app.use((error, req, res, next) => {
  logError(error)
  return res
    .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
    .send('Internal server error')
})

app.listen(app.get('port'), () => {
  log(`Web server listening on port ${app.get('port')}`)
})

module.exports = app
