// src/http/get-index/get-web-socket-url.js
module.exports = function getWS() {
  let env = process.env.NODE_ENV
  let testing = 'ws://localhost:3333'
  let staging = 'wss://lealw2cli9.execute-api.us-west-2.amazonaws.com/staging'
  let production = 'wss://b7hq38oujj.execute-api.us-west-2.amazonaws.com/production'
  if (env === 'testing')
    return testing
  if (env === 'staging')
    return staging
  if (env === 'production')
    return production
  return testing
}