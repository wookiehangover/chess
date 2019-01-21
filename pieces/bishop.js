const Piece = require('./piece')
const { coordsFromPosition, ROWS } = require('../utils')
const { getPiece } = require('../board')

class Bishop extends Piece {
  move (board, position) {
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = coordsFromPosition(position)
    const nextColIndex = ROWS.indexOf(nextCol.toUpperCase())
    const currentColIndex = ROWS.indexOf(currentCol.toUpperCase())
    let isValid = false

    // console.log('===> Move:', this.position, position)

    // A bishop can move diagonally in any direction, any number of spaces
    if (Math.abs(nextColIndex - currentColIndex) === Math.abs(nextRow - currentRow)) {
      isValid = true
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      // Extra the delta and direction for the move
      const rowDirection = nextRow > currentRow ? 1 : -1
      const rowDelta = nextRow > currentRow
        ? nextRow - currentRow : currentRow - nextRow
      const colDirection = nextColIndex > currentColIndex ? 1 : -1
      const colDelta = nextColIndex > currentColIndex
        ? nextColIndex - currentColIndex : currentColIndex - nextColIndex

      // loop through the coords to walk from (current) => (next)
      for (let i = 1, j = 1; i < rowDelta && j < colDelta; i++, j++) {
        const col = currentRow + (rowDirection * i)
        const row = ROWS[currentColIndex + (colDirection * j)].toLowerCase()
        const piece = getPiece(board, row + col)
        // console.log(`checking ${row}${col}...`, piece)
        if (piece !== false) {
          isValid = false
        }
      }

      // And if the final position is a capture, it's valid
      const piece = getPiece(board, position)
      if (piece !== false) {
        if (piece.color === this.color) {
          isValid = false
        } else {
          isValid = true
          this.capture(piece)
        }
      }
    }

    return isValid
  }

  toChar () {
    return this.color === 'white' ? '\u2657' : '\u265d'
  }
}

module.exports = {
  Bishop,
  wB: (...a) => new Bishop('white', ...a),
  bB: (...a) => new Bishop('black', ...a)
}
