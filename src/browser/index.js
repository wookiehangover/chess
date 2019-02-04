import Game from './game'
const Vue = window.Vue

let game = new Game()

game.move('e2', 'e4')
let connectionId = null

// get the web socket url from the backend
let url = window.WS_URL

// setup the web socket
let ws = new window.WebSocket(url)
ws.onopen = open
ws.onclose = close
ws.onmessage = message
ws.onerror = console.log



// sends messages to the lambda
// msg.addEventListener('keyup', function(e) {
//   if (e.key == 'Enter') {
//     let text = e.target.value // get the text
//     e.target.value = ''       // clear the text
//     ws.send(JSON.stringify({ text }))
//   }
// })

const grid = '87654321'.split('')
  .map((col) => 'abcdefgh'.split('').map((row) => `${row}${col}`))
  .reduce((result, row) => {
    result.push.apply(result, row)
    return result
  }, [])

const makeBoard = (b) => grid.reduce((result, position) => {
  result[position] = b.getPiece(position)
  return result
}, {})

const app = new Vue({
  el: '#board',
  data: {
    selected: null,
    validMoves: [],
    board: makeBoard(game.board)
  },
  methods: {
    selectPiece (piece) {
      const p = game.board.getPiece(piece)
      if (this.selected && piece) {
        game.move(this.selected, piece)
        const payload = {
          move: `${this.selected}${piece}`
        }
        if (connectionId) {
          payload.connectionId = connectionId
        }
        ws.send(JSON.stringify(payload))
        this.selected = null
        this.validMoves = []
      } else if (piece && p.color === game.nextMove) {
        this.selected = piece
        this.validMoves = p.validMoves(game.board)
      }
    },
    isSelected (position) {
      return { selected: position === this.selected }
    },
    isValid (position) {
      return {
        [position]: true,
        valid: this.validMoves.includes(position)
      }
    }
  }
})

const controls = new Vue({
  el: '#controls',
  data: {
    connectionId: null
  },
  watch: {
    connectionId (newId, oldId) {
      connectionId = newId
    }
  }
})

// connect to the web socket
function open () {
  // let ts = new Date(Date.now()).toISOString()
  // main.innerHTML = `<p><b><code>${ts} - opened</code></b></p>`
  console.log('connected!')
}

// report a closed web socket connection
function close () {
  console.log('closed!')
}

// write a message into main
function message (e) {
  let msg = JSON.parse(e.data)
  // main.innerHTML += `<p><code>${msg.text}</code></p>`
  console.log('data', msg)
  if (msg.move) {
    const from = msg.move.substr(0, 2)
    const to = msg.move.substr(2, 4)
    game.move(from, to)
  }
}
window.app = app
window.game = game

game.on('move', () => {
  app.board = makeBoard(game.board)
})
