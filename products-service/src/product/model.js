exports.findAll = async () => {
  const db = require('../database').db()
  if (!db) {
    return []
  }
  const products = await db.collection('products').find({}, { projection: { _id: 0 } }).toArray()
  return products
}
