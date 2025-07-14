const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for accounts API
  app.use(
    '/accounts',
    createProxyMiddleware({
      target: 'http://34.221.119.89:8000',
      changeOrigin: true,
      secure: false, // Allow HTTP backend
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('❌ Proxy Error:', err.message);
        res.status(500).send('Proxy Error: ' + err.message);
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔄 Proxying request to:', proxyReq.getHeader('host') + proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ Proxy response status:', proxyRes.statusCode);
      }
    })
  );
  
  // Add other API routes as needed
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://34.221.119.89:8000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('❌ Proxy Error:', err.message);
        res.status(500).send('Proxy Error: ' + err.message);
      }
    })
  );
};
