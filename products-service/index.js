require('dotenv').config()

const ProductsServer = require('./src/server')
const app = new ProductsServer()
app.listen()
