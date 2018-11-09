const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const { log, logError } = require('./helpers/logger')
const httpStatus = require('./helpers/http-status')
const DiscountService = require('./services/discount')

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
  return next();
})

app.get('/product', (req, res, next) => {
  try {
    const discountService = new DiscountService()
    discountService.get((error, products) => {
      if (error) {
        logError(error)
        return res.json(products)
      }
      return res.json(products)
    })
  } catch (error) {
    return next(error)
  }
})

app.use((error, req, res, next) => {
  logError(error)
  return res
    .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
    .send('Internal server error')
})

app.listen(app.get('port'), () => {
  log(`Web server listening on port ${app.get('port')}`)
})
