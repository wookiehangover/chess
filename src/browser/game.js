import { coordsFromPosition, printBoard, EMPTY_CELL } from './utils'
import { createBoard, movePiece, getPiece } from './board'
import { EventEmitter } from 'events'

import pieces from './pieces'
const {
  wP, bP,
  wR, bR,
  wN, bN,
  wB, bB,
  wQ, bQ,
  wK, bK
} = pieces

// Let's Play

const defaultPieces = [
  bR('a8'), bN('b8'), bB('c8'), bQ('d8'), bK('e8'), bB('f8'), bN('g8'), bR('h8'),
  bP('a7'), bP('b7'), bP('c7'), bP('d7'), bP('e7'), bP('f7'), bP('g7'), bP('h7'),
  wP('a2'), wP('b2'), wP('c2'), wP('d2'), wP('e2'), wP('f2'), wP('g2'), wP('h2'),
  wR('a1'), wN('b1'), wB('c1'), wQ('d1'), wK('e1'), wB('f1'), wN('g1'), wR('h1')
]

export default class Game extends EventEmitter {
  constructor (pieces = defaultPieces) {
    super()
    this.history = []
    this.pieces = pieces
    this.board = createBoard(pieces)
    this.on('move', printBoard)
    printBoard(this.board)
  }

  get lastMove () {
    return this.history[this.history.length - 1]
  }

  get nextMove () {
    if (this.history.length === 0) {
      return 'white'
    } else {
      return this.board.getPiece(this.lastMove[2]).color === 'white' ? 'black' : 'white'
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

    if (p.color !== this.nextMove) {
      board = false
      console.log(`Slow down there. It's ${this.nextMove}'s turn.`)
    }

    if (board !== false) {
      const captured = getPiece(this.board, position)
      // Add this move to history, taking a snapshot of the board prior to moving anything
      this.update(piece, position)
      // Replace the piece with an empty cell
      board.write(p.coords, EMPTY_CELL)
      // Move the piece to its new position
      board.write(coordsFromPosition(position), p)
      // Finally, make sure the piece knows its new position
      p.position = position
      // Move event happens
      this.emit('move', board)
      // if a piece was captured, broadcast an event
      if (captured) {
        this.emit('capture', captured)
      }
    }

    return this.board
  }
}
