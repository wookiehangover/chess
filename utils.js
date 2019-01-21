const chalk = require('chalk')

exports.coordsFromPosition = (position) => {
  const [ col, row ] = position.split('')
  return [ col, parseInt(row, 10) ]
}

exports.EMPTY_CELL = '---'

const getRow = (board, row) => {
  const r = row - 1
  return [
    board.a[r], board.b[r], board.c[r], board.d[r],
    board.e[r], board.f[r], board.g[r], board.h[r]
  ]
}

const ROWS = exports.ROWS = 'abcdefgh'.split('')
const COLS = '87654321'.split('')

const direction = (x, y) => x > y ? 1 : -1

const size = (x, y) => x > y ? x - y : y - x

exports.getVectors = ([ currentCol, currentRow ], [ nextCol, nextRow ]) => {
  const nextColIndex = ROWS.indexOf(nextCol)
  const currentColIndex = ROWS.indexOf(currentCol)

  const row = [
    direction(nextRow, currentRow),
    size(nextRow, currentRow)
  ]
  const col = [
    direction(nextColIndex, currentColIndex),
    size(nextColIndex, currentColIndex)
  ]

  return [ row, col ]
}

const printPiece = (piece) => {
  if (piece.color === 'white') {
    return chalk.white.bold(piece)
  } else {
    return chalk.gray.bold(piece)
  }
}

const printPieces = (board) => {
  const pieces = board.pieces.reduce((result, p) => {
    result[p.color].push(p.toChar())
    return result
  }, { black: [], white: [] })

  const black = pieces.black.sort().join(' ')
  const white = pieces.white.sort().join(' ')

  console.log('w: ' + chalk.cyan(white))
  console.log('b: ' + chalk.green(black))
}

const printRow = (board, i) => {
  const row = getRow(board, i).map(printPiece).join(' ')
  console.log(`${i}: ${row}`)
}

exports.printBoard = (board) => {
  if (board === false) {
    console.log('Invalid Board!')
    return
  }
  console.log('')
  COLS.forEach(col => printRow(board, col))
  console.log(`   ${ROWS.join('   ')}\n`)
  printPieces(board)
  console.log('')
}
