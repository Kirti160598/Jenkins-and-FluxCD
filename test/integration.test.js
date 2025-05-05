const request = require('supertest');
const { app } = require('../app.js');

describe('Integration test GET /greet/:name', () => {
  test('responds with greeting message', async () => {
    const res = await request(app).get('/greet/Kirti');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello, Kirti!');
  });
});

