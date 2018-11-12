const MongoClient = require('mongodb').MongoClient;
const { log, logError } = require('./helpers/logger')

class Database {
  constructor () {
    this.url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`
    this.db = null
    this.productsCollection = null
    this.usersCollection = null
    this.timeouted = false
    this.timeoutHandler = setTimeout(() => { timeouted = true }, 1000 * 60 * 2)
  }

  connect () {
    MongoClient.connect(this.url, (err, client) => {
      if (this.timeouted) return
      if (err) {
        setTimeout(this.connect, 2000)
      } else {
        clearTimeout(this.timeoutHandler)
        this.timeoutHandler = null
        log('Connected succesfully to mongoDB')
        this.db = client.db(process.env.DB_NAME)
        this.productsCollection = this.db.collection('products')
        this.usersCollection = this.db.collection('users')
      }
    })
  }

  usersCollection () {
    return this.usersCollection
  }

  productsCollection () {
    return this.productsCollection
  }
}

module.exports = Database
