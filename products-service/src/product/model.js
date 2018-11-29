exports.findAll = async () => {
  const db = require('../database').get()
  if (!db) {
    return []
  }
  const products = await db.collection('products').find({}, { projection: { _id: 0 } }).toArray()
  return products
}
