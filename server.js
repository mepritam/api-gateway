const express = require('express');
const services = require('./services');
const cors = require('cors');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

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