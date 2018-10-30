class Logger {
  static log (info) {
    console.log(`[${new Date()}] - ${JSON.stringify(info)}`)
  }

  static logError (info) {
    console.error(`[${new Date()}] - ${JSON.stringify(info)}`)
  }
}

module.exports = Logger
