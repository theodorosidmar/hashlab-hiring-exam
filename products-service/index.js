require('dotenv').config()
require('./src/database').connect()
require('./src/server')
