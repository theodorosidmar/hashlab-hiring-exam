const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

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
      const birthdate = (new Date).getTime()
      const products = [
        {
          id: '1',
          priceincents: 500,
          title: 'Título 1',
          description: 'Descrição 1'
        },
        {
          id: '2',
          priceincents: 1000,
          title: 'Título 2',
          description: 'Descrição 2'
        },
        {
          id: '3',
          priceincents: 1500,
          title: 'Título 3',
          description: 'Descrição 3'
        }
      ]
      this.client.get({ birthdate, products }, callback)
    } catch (error) {
      callback(error)
    }
  }
}

module.exports = DiscountService
