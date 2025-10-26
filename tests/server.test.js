const request = require('supertest');
const app = require('../server');

describe('Link Shortener API', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should shorten a valid URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body).toHaveProperty('originalUrl', 'https://example.com');
  });

  it('should return 400 for missing URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'URL is required');
  });

  it('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'invalid-url' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/Invalid URL|malicious content|protocol/);
  });

  it('should redirect to original URL for valid short ID', async () => {
    // First, create a short link
    const shortenRes = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' });
    const shortId = shortenRes.body.shortUrl.split('/').pop();

    // Then, test redirect
    const res = await request(app).get(`/${shortId}`);
    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toBe('https://example.com');
  });

  it('should return 404 for invalid short ID', async () => {
    const res = await request(app).get('/invalidid');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Link not found');
  });

  it('should work with /shortenUrl endpoint', async () => {
    const res = await request(app)
      .post('/shortenUrl')
      .send({ url: 'https://example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body).toHaveProperty('originalUrl', 'https://example.com');
  });

  it('should return 400 for malicious URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'javascript:alert("xss")' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/protocol|malicious/);
  });
});
