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

const ROWS = exports.ROWS = 'ABCDEFGH'.split('')

const printPiece = (piece) => {
  if (piece.color === 'white') {
    return chalk.white.bold(piece)
  } else {
    return chalk.gray.bold(piece)
  }
}

exports.printBoard = (b) => {
  if (b === false) {
    console.log('Invalid Board!')
    return
  }
  console.log('')
  console.log(`8: ${getRow(b, 8).map(printPiece).join(' ')}`)
  console.log(`7: ${getRow(b, 7).map(printPiece).join(' ')}`)
  console.log(`6: ${getRow(b, 6).map(printPiece).join(' ')}`)
  console.log(`5: ${getRow(b, 5).map(printPiece).join(' ')}`)
  console.log(`4: ${getRow(b, 4).map(printPiece).join(' ')}`)
  console.log(`3: ${getRow(b, 3).map(printPiece).join(' ')}`)
  console.log(`2: ${getRow(b, 2).map(printPiece).join(' ')}`)
  console.log(`1: ${getRow(b, 1).map(printPiece).join(' ')}`)
  console.log(`   ${ROWS.join('   ')}`)
  console.log('')
}
