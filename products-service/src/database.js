const MongoClient = require('mongodb').MongoClient
const { log, logError } = require('./helpers/logger')

const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME
const dbPort = process.env.DB_PORT
const url = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`

let timeouted = false
let timeoutHandler = setTimeout(() => { timeouted = true }, 1000 * 60 * 2)

let state = {
  db: null
}

const connect = () => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (timeouted) return
    if (err) {
      logError(`Couldn't connect to mongoDB. Trying to reconnect...`)
      setTimeout(connect.bind(this), 5000)
    } else {
      clearTimeout(timeoutHandler)
      timeoutHandler = null
      state.db = client.db(process.env.DB_NAME)
      log('Connected succesfully to mongoDB')
    }
  })
}

exports.connect = connect
exports.get = () => {
  return state.db
}
