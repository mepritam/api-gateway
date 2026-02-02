const express = require('express');
const services = require('./services');
const cors = require('cors');

const { createProxyMiddleware } = require('http-proxy-middleware');
const CircuitBreaker = require('opossum');

// OWSAP: A06
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});

const app = express();
app.use(cors());
app.use(limiter);

app.listen(4000, () => {
  console.log('API Gateway running on port 4000');
});

app.use('/api/v1/user', createProxyMiddleware({
  target: services.todoService,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/user': '' }
}));

app.use('/auth', createProxyMiddleware({
  target: services.userService,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

//  Circuit breakers
// const todoServiceBreaker = new CircuitBreaker(proxyTodo, {
//   timeout: 20000,
//   errorThresholdPercentage: 80,
//   resetTimeout: 10000
// });

// const userServiceBreaker = new CircuitBreaker(proxyUser, {
//   timeout: 20000,
//   errorThresholdPercentage: 80,
//   resetTimeout: 10000
// });

// // Routes (manual fallback, safe)
// app.use('/api/v1/user', async (req, res) => {
//   try {
//     await todoServiceBreaker.fire(req, res);
//   } catch (err) {
//     if (!res.headersSent) {
//       res.status(503).json({ message: 'Todo service unavailable' });
//     }
//   }
// });

// app.use('/auth', async (req, res) => {
//   try {
//     await userServiceBreaker.fire(req, res);
//   } catch (err) {
//     if (!res.headersSent) {
//       res.status(503).json({ message: 'User service unavailable' });
//     }
//   }
// });

// todoServiceBreaker.on('open', () => console.log('Todo breaker OPEN'));
// todoServiceBreaker.on('halfOpen', () => console.log('Todo breaker HALF-OPEN'));
// todoServiceBreaker.on('close', () => console.log('Todo breaker CLOSED'));
// todoServiceBreaker.on('failure', err => console.log('Todo failure:', err.message));