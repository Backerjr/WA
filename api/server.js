import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON / form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight request logger with response time
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durMs = Number((process.hrtime.bigint() - start) / 1000000n);
    // Example: GET /users -> 200 12ms
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${durMs}ms`);
  });
  next();
});

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Demo route (root)
app.get('/', (req, res) => {
  res.send('Hello World from Polyglot Starter API!');
});

// API status endpoint with more details
app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Sample data endpoint
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Sample data from API',
    items: [
      { id: 1, name: 'Item One', category: 'Example' },
      { id: 2, name: 'Item Two', category: 'Demo' },
      { id: 3, name: 'Item Three', category: 'Sample' }
    ],
    meta: {
      count: 3,
      timestamp: new Date().toISOString()
    }
  });
});

// Sample POST endpoint
app.post('/api/echo', (req, res) => {
  res.json({
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Route to intentionally trigger an error (for testing 500 handling)
app.get('/error', (req, res, next) => {
  next(new Error('Intentional error to test 500 handling'));
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Log full error details on server
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  const body = {
    error: err && err.message ? err.message : 'Internal Server Error',
  };
  if (process.env.NODE_ENV !== 'production' && err && err.stack) {
    body.stack = err.stack;
  }
  res.status(status).json(body);
});

// Only start server if this file is run directly (not imported for tests)
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

// Export app for testing
export default app;
