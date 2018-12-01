const request = require('supertest')
const server = require('../src/server')

test('products:findAll', async () => {
  const res = await request(server).get('/product')
  expect(res.status).toBe(200)
})
