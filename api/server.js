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

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Demo route (root)
app.get('/', (req, res) => {
  res.send('Hello World from Polyglot Starter API!');
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

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
