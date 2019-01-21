const { printBoard } = require('./utils')
const { createBoard, movePiece, getPiece } = require('./board')

const {
  wP, bP,
  wR, bR,
  wN, bN,
  wB, bB,
  wQ, bQ,
  wK, bK
} = require('./pieces')

// Let's Play

const defaultPieces = [
  bR('a8'), bN('b8'), bB('c8'), bQ('d8'), bK('e8'), bB('f8'), bK('g8'), bR('h8'),
  bP('a7'), bP('b7'), bP('c7'), bP('d7'), bP('e7'), bP('f7'), bP('g7'), bP('h7'),
  wP('a2'), wP('b2'), wP('c2'), wP('d2'), wP('e2'), wP('f2'), wP('g2'), wP('h2'),
  wR('a1'), wN('b1'), wB('c1'), wQ('d1'), wK('e1'), wB('f1'), wK('g1'), wR('h1')
]

class Game {
  constructor (pieces = defaultPieces) {
    this.history = []
    this.pieces = pieces
    this.board = createBoard(pieces)
    printBoard(this.board)
  }

  get lastMove () {
    return this.history[this.history.length - 1]
  }

  get nextMove () {
    if (this.history.length === 0) {
      return 'white'
    } else {
      return this.lastMove.color === 'white' ? 'black' : 'white'
    }
  }

  update (piece, position) {
    this.history.push([
      this.pieces.map(p => p.clone()),
      piece,
      position
    ])
  }

  move (piece, position) {
    const p = getPiece(this.board, piece)
    let board = movePiece(this.board, piece, position)

    if (this.history.length > 1) {
      const [ lastPiece ] = this.lastMove
      if (lastPiece.color === p.color) {
        board = false
        console.log(`Slow down there. It's not ${lastPiece.color}'s turn yet.`)
      }
    }

    if (board !== false) {
      this.update(piece, position)
      p.position = position
    }

    printBoard(board)
    return this.board
  }
}

exports.Game = Game
