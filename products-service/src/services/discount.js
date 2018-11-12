const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

class DiscountService {
  constructor () {
    this.discountServiceUrl = `${process.env.DISCOUNTS_SERVICE_HOST}:${process.env.DISCOUNTS_SERVICE_PORT}`
    this.protoPath = process.env.NODE_ENV === 'production' ?
      path.join(__dirname, '../protos', 'discount.proto') :
      path.join(__dirname, '../../../', 'protos', 'discount.proto')
    this.packageDefinition = protoLoader.loadSync(this.protoPath, { keepCase: true })
    this.proto = grpc.loadPackageDefinition(this.packageDefinition).discount
    this.client = new this.proto.Service(this.discountServiceUrl, grpc.credentials.createInsecure())
  }

  get (birth_date, products, callback) {
    this.client.get({ birth_date, products }, callback)
  }
}

module.exports = DiscountService
