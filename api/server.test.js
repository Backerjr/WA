import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server.js';

describe('API Health and Basic Routes', () => {
  it('should return 200 on health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('number');
  });

  it('should return welcome message on root', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello World');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('path', '/nonexistent');
  });
});

describe('API Status Endpoint', () => {
  it('should return operational status', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'operational');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('version', '1.0.0');
    expect(response.body).toHaveProperty('environment');
  });

  it('should return valid ISO timestamp', async () => {
    const response = await request(app).get('/api/status');
    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });
});

describe('API Data Endpoint', () => {
  it('should return sample data with items', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBe(3);
  });

  it('should return items with correct structure', async () => {
    const response = await request(app).get('/api/data');
    const firstItem = response.body.items[0];
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('name');
    expect(firstItem).toHaveProperty('category');
  });

  it('should return metadata', async () => {
    const response = await request(app).get('/api/data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('count', 3);
    expect(response.body.meta).toHaveProperty('timestamp');
  });
});

describe('API Echo Endpoint', () => {
  it('should echo POST data', async () => {
    const testData = { test: 'value', number: 42 };
    const response = await request(app)
      .post('/api/echo')
      .send(testData)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('received');
    expect(response.body.received).toEqual(testData);
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should handle empty POST body', async () => {
    const response = await request(app)
      .post('/api/echo')
      .send({})
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.body.received).toEqual({});
  });
});

describe('Error Handling', () => {
  it('should handle intentional errors with 500', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Intentional error');
  });
});

describe('CORS Headers', () => {
  it('should include CORS headers', async () => {
    const response = await request(app).get('/api/status');
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toBeDefined();
  });

  it('should handle OPTIONS requests', async () => {
    const response = await request(app).options('/api/status');
    expect(response.status).toBe(200);
  });
});
