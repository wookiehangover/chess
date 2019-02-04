let arc = require('@architect/functions')

/**
 * append a timestamp and echo the message back to the connectionId
 */
exports.handler = async function ws(event) {

  console.log('ws-default called with', event)

  let ts = new Date(Date.now()).toISOString()
  let message = JSON.parse(event.body)
  let connectionId = message.connectionId || event.requestContext.connectionId
  // let text = `${ts} - ${message.text}`

  await arc.ws(event).send({
    id: connectionId,
    payload: Object.assign(message, { connectionId })
  })

  return { statusCode: 200 }
}