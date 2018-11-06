const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const Logger = require('../helpers/logger')

class DiscountService {
  constructor () {
    const url = `${process.env.DISCOUNTS_SERVICE_HOST}:${process.env.DISCOUNTS_SERVICE_PORT}`
    const protoPath = process.env.NODE_ENV === 'production' ?
      path.join(__dirname, '../', 'protos', 'discount.proto') :
      path.join(__dirname, '../../../', 'protos', 'discount.proto')
    const packageDefinition = protoLoader.loadSync(protoPath)
    const discountProto = grpc.loadPackageDefinition(packageDefinition).discount
    this.client = new discountProto.Service(url, grpc.credentials.createInsecure())
  }

  get (callback) {
    try {
      const products = [
        {
          id: '1',
          price_in_cents: 500,
          title: 'Título 1',
          description: 'Descrição 1'
        },
        {
          id: '2',
          price_in_cents: 1000,
          title: 'Título 2',
          description: 'Descrição 2'
        },
        {
          id: '3',
          price_in_cents: '1500',
          title: 'Título 3',
          description: 'Descrição 3'
        }
      ]
      this.client.get({ products }, callback)
    } catch (error) {
      callback(error)
    }
  }
}

module.exports = DiscountService
