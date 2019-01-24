import Game from './game'

/*
// Knight Test Case
const { wN, bN } = require('./pieces')
let game = new Game([
  bN('b8'),
  wN('g1')
])
game.move('g1', 'e2')
game.move('b8', 'c6')
game.move('e2', 'f4')
game.move('c6', 'd4')
game.move('f4', 'e6')
game.move('d4', 'e6')
*/

let game = new Game()

game.move('e2', 'e4')
game.move('e7', 'e5')
game.move('g1', 'f3')
game.move('b8', 'c6')
game.move('g2', 'g3')
game.move('d7', 'd5')
game.move('e4', 'd5')
game.move('d8', 'd5')
game.move('b1', 'c3')
game.move('d5', 'a5')
game.move('f1', 'g2')

const printMoves = (board, position) => {
  const piece = board.getPiece(position)
  const moves = piece && piece.validMoves(board)
  if (piece && moves.length > 0) {
    console.log(`${piece.toChar()} ${piece.position} =>`, moves.join(', '))
  }
}

console.log(`Next move: ${game.nextMove}`)
console.log('\nPossible moves:')
game.pieces.forEach((piece) => {
  if (piece.color === game.nextMove) {
    printMoves(game.board, piece.position)
  }
})

// game.move('f1', 'b5')
// game.move('c7', 'c6')
// game.move('d1', 'h5')
// game.move('c6', 'b5')
// game.move('h5', 'e5')
