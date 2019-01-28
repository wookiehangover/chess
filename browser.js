import Game from './src/game'

let game = new Game()

game.move('e2', 'e4')

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

window.app = app
window.game = game

game.on('move', () => {
  app.board = makeBoard(game.board)
})
