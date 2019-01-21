const Piece = require('./piece')
const { coordsFromPosition, ROWS } = require('../utils')
const { getPiece, walkDiagonal } = require('../board')

class Bishop extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position)
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = nextCoords
    const nextColIndex = ROWS.indexOf(nextCol)
    const currentColIndex = ROWS.indexOf(currentCol)
    let isValid = false

    // console.log('===> Move:', this.position, position)

    // A bishop can move diagonally in any direction, any number of spaces
    if (Math.abs(nextColIndex - currentColIndex) === Math.abs(nextRow - currentRow)) {
      isValid = true
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      // loop through the coords to walk from (current) => (next)
      isValid = walkDiagonal(board, this.coords, nextCoords)

      // And if the final position is a capture, it's valid
      const piece = getPiece(board, position)
      if (piece !== false && isValid) {
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
