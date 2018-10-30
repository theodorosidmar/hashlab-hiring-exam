const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const Logger = require('../helpers/logger')

class DiscountService {
  constructor () {
    const url = `${process.env.DISCOUNTS_SERVICE_HOST}:${process.env.DISCOUNTS_SERVICE_PORT}`
    const protoPath = path.join(__dirname, '../', 'protos', 'discount.proto')
    const packageDefinition = protoLoader.loadSync(protoPath)
    const proto = grpc.loadPackageDefinition(packageDefinition)
    this.client = new proto.Discount(url, grpc.credentials.createInsecure())
  }

  get (userId, callback) {
    try {
      this.client.get({ user_id: userId }, callback)
    } catch (error) {
      Logger.logError(error)
      callback(error)
    }
  }
}

module.exports = DiscountService
