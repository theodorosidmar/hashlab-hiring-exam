exports.log = (info) => console.log(`[${new Date()}] - ${JSON.stringify(info)}`)
exports.logError = (info) => console.error(`[${new Date()}] - ${JSON.stringify(info)}`)
