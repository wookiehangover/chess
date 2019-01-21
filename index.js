const { printBoard } = require('./utils')
const { createBoard, movePiece } = require('./board')

const {
  wP, bP,
  wR, bR,
  wN, bN,
  wB, bB,
  wQ, bQ,
  wK, bK
} = require('./pieces')

// Let's Play

let game = createBoard([
  bR('a8'), bN('b8'), bB('c8'), bQ('d8'), bK('e8'), bB('f8'), bK('g8'), bR('h8'),
  bP('a7'), bP('b7'), bP('c7'), bP('d7'), bP('e7'), bP('f7'), bP('g7'), bP('h7'),
  wP('a2'), wP('b2'), wP('c2'), wP('d2'), wP('e2'), wP('f2'), wP('g2'), wP('h2'),
  wR('a1'), wN('b1'), wB('c1'), wQ('d1'), wK('e1'), wB('f1'), wK('g1'), wR('h1')
])

printBoard(game)

const move = (...m) => printBoard(movePiece(game, ...m))

move('e2', 'e4')
move('d7', 'd5')
move('e4', 'd5')
move('d8', 'd5')
move('c2', 'c4')
move('d5', 'c4')
