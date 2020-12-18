// const proxy = require('http-proxy-middleware')
// import { createProxyMiddleware } from 'html-webpack-plugin'
const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
  console.log('test213123123123')
  app.use(
    createProxyMiddleware('/api', {
      target: "http://192.168.23.123:9006/eanew",
      changeOrgin: true,
      pathRewrite: {
        "^/api": ""
      }
    })
  )
}