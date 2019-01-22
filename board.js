const {
  coordsFromPosition,
  getVectors,
  EMPTY_CELL,
  COLS,
  ROWS
} = require('./utils')

class Board {
  constructor (pieces = []) {
    ROWS.forEach(col => {
      this[col] = new Array(8).fill(EMPTY_CELL, 0, 8)
    })

    pieces.forEach((piece) => {
      const [ col, row ] = piece.coords
      this[col].splice(row - 1, 1, piece)
    })
  }

  get pieces () {
    return ROWS.map(r => this[r]).reduce((result, r) => {
      result.push.apply(result, r.filter(cell => cell !== EMPTY_CELL))
      return result
    }, [])
  }

  forEach (callback) {
    ROWS.forEach(row => {
      COLS.forEach(col => {
        callback.call(this, row + col)
      })
    })
  }

  getPiece (position) {
    return getPiece(this, position)
  }

  walk (p1, p2) {
    return walk(this, p1, p2)
  }

  walkDiagonal (p1, p2) {
    return walkDiagonal(this, p1, p2)
  }
}

const createBoard = (pieces) => {
  return new Board(pieces)
}

const getPiece = (board, position) => {
  const [ col, row ] = coordsFromPosition(position)
  const piece = board[col][row - 1]

  if (piece && piece.color && piece.name) {
    return piece
  } else {
    return false
  }
}

const movePiece = (board, piece, position) => {
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
  } else {
    console.log(`${piece}->${position} isn't a valid move!`)
    return false
  }

  return board
}

const walk = (board, [ currentCol, currentRow ], [ nextCol, nextRow ]) => {
  let isValid = true
  // Determine the delta and direction for the move
  const [
    [ rowDirection, rowDelta ],
    [ colDirection, colDelta ]
  ] = getVectors([ currentCol, currentRow ], [ nextCol, nextRow ])

  // loop through the coords to walk from (current) => (next)
  const spaces = colDelta + rowDelta
  const currentColIndex = ROWS.indexOf(currentCol)
  for (let i = 1; i < spaces; i++) {
    // WARNING: clever code ahead!
    // Math.min({col,row}Delta, 1) = 0, when the value hasn't changed, e.g. row + (i * 0) = row
    const row = currentRow + (rowDirection * i * Math.min(rowDelta, 1))
    const col = ROWS[currentColIndex + (colDirection * i * Math.min(colDelta, 1))]
    const piece = getPiece(board, col + row)
    // console.log(`checking ${col}${row}...`, piece)
    if (piece) {
      isValid = false
      break
    }
  }

  return isValid
}

const walkDiagonal = (board, [ currentCol, currentRow ], [ nextCol, nextRow ]) => {
  let isValid = true
  // Determine the delta and direction for the move
  const [
    [ rowDirection, rowDelta ],
    [ colDirection, colDelta ]
  ] = getVectors([ currentCol, currentRow ], [ nextCol, nextRow ])

  // loop through the coords to walk from (current) => (next)
  if (colDelta > 0 && rowDelta > 0) {
    // when both row and column values have changed, walk by incrementing x and y simultaneously
    const currentColIndex = ROWS.indexOf(currentCol)
    for (let x = 1, y = 1; x < rowDelta && y < colDelta; x++, y++) {
      const row = currentRow + (rowDirection * x)
      const col = ROWS[currentColIndex + (colDirection * y)]
      const piece = getPiece(board, col + row)
      // console.log(`checking ${row}${col}...`, piece)
      if (piece) {
        isValid = false
        break
      }
    }
  }

  return isValid
}

module.exports = {
  createBoard,
  getPiece,
  getVectors,
  movePiece,
  walk,
  walkDiagonal
}
