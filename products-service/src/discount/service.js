const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

const discountServiceUrl = `${process.env.DISCOUNTS_SERVICE_HOST}:${process.env.DISCOUNTS_SERVICE_PORT}`
const protoPath = process.env.NODE_ENV === 'production' ?
  path.join(__dirname, '../protos', 'discount.proto') :
  path.join(__dirname, '../../../', 'protos', 'discount.proto')
const packageDefinition = protoLoader.loadSync(protoPath, { keepCase: true })
const proto = grpc.loadPackageDefinition(packageDefinition).discount
const client = new proto.Service(discountServiceUrl, grpc.credentials.createInsecure())

const get = (birth_date, products, callback) => {
  client.get({ birth_date, products }, callback)
}

exports.get = get
