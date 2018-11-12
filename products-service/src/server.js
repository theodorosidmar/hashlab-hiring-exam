const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const DiscountService = require('./services/discount')
const Database = require('./database')
const { log, logError } = require('./helpers/logger')
const httpStatus = require('./helpers/http-status')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT
    this.discountService = new DiscountService()
    this.db = new Database()
    this.db.connect()
    this.app.use(helmet())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use((req, res, next) => {
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
    this.app.get('/product', async (req, res, next) => {
      try {
        let user = null
        const products = await this.db.products.find().toArray()
        if (req.user.id) {
          user = await this.db.users.findOne({ public_id: req.user.id })
        }
        if (user) {
          this.discountService.get(user.birth_date.getTime(), products, (error, productsResponse) => {
            if (error) {
              logError(error)
              return res.json({ products })
            }
            return res.json(productsResponse)
          })
        } else {
          return res.json({ products })
        }
      } catch (error) {
        return next(error)
      }
    })
    this.app.use((error, req, res, next) => {
      logError(error)
      return res
        .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error')
    })
  }

  listen () {
    this.app.listen(this.port, () => {
      log(`Web server listening on port ${this.port}`)
    })
  }
}

module.exports = Server
