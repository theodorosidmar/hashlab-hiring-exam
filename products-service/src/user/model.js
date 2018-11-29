exports.findById = async (id) => {
  const db = require('../database').get()
  if (!db) {
    return null
  }
  const user = await db.collection('users').findOne({ public_id: id })
  return user
}
