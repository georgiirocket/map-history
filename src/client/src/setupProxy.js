const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    const socketProxy = createProxyMiddleware('/socket.io', {
        target: 'http://localhost:5006/socket.io',
        changeOrigin: true,
        ws: true,
        // logLevel: 'debug',
    });
    const socketProxyApi = createProxyMiddleware('/api', {
        target: 'http://localhost:5006',
        changeOrigin: true,
        ws: false,
        logLevel: 'debug',
    });

    app.use(socketProxy);
    app.use(socketProxyApi);
};