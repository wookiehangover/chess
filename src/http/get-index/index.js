// @architect/functions enables secure sessions, express-style middleware and more
// let arc = require('@architect/functions')
// let url = arc.http.helpers.url

// exports.handler = async function http(req) {
//   console.log(req)
//   return {
//     type: 'text/html; charset=utf8',
//     body: '<h1>Hello world!</h1>'
//   }
// }

// Example responses

/* Forward requester to a new path
exports.handler = async function http(request) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(request)
  }
  return {
    status: 302,
    location: '/staging/about',
  }
}
*/

/* Successful resource creation, CORS enabled
exports.handler = async function http(request) {
  return {
    status: 201,
    type: 'application/json',
    body: JSON.stringify({ok: true}),
    cors: true,
  }
}
*/

/* Deliver client-side JS
exports.handler = async function http(request) {
  return {
    type: 'text/javascript',
    body: 'console.log("Hello world!")',
  }
}
*/

// Learn more: https://arc.codes/guides/http

// src/http/get-index
let getURL = require('./get-web-socket-url')
let arc = require('@architect/functions')

/**
 * renders the html app chrome
 */
exports.handler = async function http(req) {
  let js = 'https://s3-us-west-2.amazonaws.com/chessbot-staging-1234/index.mjs'
  return {
    type: 'text/html; charset=utf8',
    body: `<!doctype html>
<html>
<body>
<h1>Web sockets</h1>
<main>Loading...</main>
<input id=message type=text placeholder="Enter message" autofocus>
<script>
window.WS_URL = '${getURL()}'
</script>
<script type=module src=${js}></script>
</body>
</html>`
  }
}