const request = require('supertest')
const app = require('../app')

describe('should test a GET request to users endpoint', () => {
  test('should respond with a 200 status code', async () => {
    const res = await request(app).get('/api/users')
    expect(res.statusCode).toEqual(200)
  })
  test('should return a JSON object with an data array', async () => {
    const res = await request(app).get('/api/users')
    expect(res._body.success).toBe(1)
    expect(Array.isArray(res._body.data)).toBe(true)
  })
})
