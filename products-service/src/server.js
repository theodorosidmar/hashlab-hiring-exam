const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const Database = require('./database')
const { log, logError } = require('./helpers/logger')
const httpStatus = require('./helpers/http-status')

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const discountServiceUrl = `${process.env.DISCOUNTS_SERVICE_HOST}:${process.env.DISCOUNTS_SERVICE_PORT}`
const protoPath = process.env.NODE_ENV === 'production' ?
  path.join(__dirname, 'protos', 'discount.proto') :
  path.join(__dirname, '../../', 'protos', 'discount.proto')
const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true })
const discountProto = grpc.loadPackageDefinition(packageDefinition).discount
const discountClient = new discountProto.Service(discountServiceUrl, grpc.credentials.createInsecure())

const db = new Database()
db.connect()

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

app.get('/product', async (req, res, next) => {
  try {
    let user = null
    const products = await db.productsCollection.find().toArray()
    if (req.user.id) {
      user = await db.usersCollection.findOne({ public_id: req.user.id })
    }
    if (user) {
      discountClient.get({ birth_date: user.birth_date.getTime(), products }, (error, productsResponse) => {
        if (error) {
          logError(error)
          return res.json(products)
        }
        return res.json(productsResponse)
      })
    } else {
      return res.json(products)
    }
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
