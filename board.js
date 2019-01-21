const {
  coordsFromPosition,
  EMPTY_CELL
} = require('./utils')

const row = () => new Array(8).fill(EMPTY_CELL, 0, 8)

const Board = exports.Board = () => ({
  a: row(),
  b: row(),
  c: row(),
  d: row(),
  e: row(),
  f: row(),
  g: row(),
  h: row()
})

exports.createBoard = (pieces) => {
  const board = Board()

  pieces.forEach((piece) => {
    const [ col, row ] = piece.coords
    board[col].splice(row - 1, 1, piece)
  })

  return board
}

const getPiece = exports.getPiece = (board, position) => {
  const [ col, row ] = coordsFromPosition(position)
  const piece = board[col][row - 1]

  if (piece && piece.color && piece.name) {
    return piece
  } else {
    return false
  }
}

exports.movePiece = (board, piece, position) => {
  const p = getPiece(board, piece)

  if (p === false) {
    return false
  }

  const move = p.move(board, position)

  if (move === true) {
    console.log(`${p.color}: ${piece} -> ${position}`)

    let [ col, row ] = p.coords
    board[col].splice(row - 1, 1, EMPTY_CELL)

    let [ x, y ] = coordsFromPosition(position)
    board[x].splice(y - 1, 1, p)

    p.position = position
  } else {
    console.log(`${piece}->${position} isn't a valid move!`)
    return false
  }

  return board
}
