const model = require('./model')
const userModel = require('../user/model')
const discountService = require('../discount/service')
const { logError } = require('../helpers/logger')

module.exports = {
  async findAll(req, res, next) {
    try {
      let user = null
      const products = await model.findAll()
      if (req.user.id) {
        user = await userModel.findById(req.user.id)
      }
      if (user) {
        discountService.byBirthDate(user.birth_date.getTime(), products, (error, productsResponse) => {
          if (error) {
            logError(error)
            return res.json({ products })
          }
          return res.json(productsResponse)
        })
      } else {
        return res.json({ products })
      }
    } catch (error) {
      return next(error)
    }
  }
}
