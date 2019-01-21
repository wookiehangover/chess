const Piece = require('./piece')
const { coordsFromPosition, getVectors, ROWS } = require('../utils')
const { getPiece, walk, walkDiagonal } = require('../board')

class Queen extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position)
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = nextCoords
    const nextColIndex = ROWS.indexOf(nextCol)
    const currentColIndex = ROWS.indexOf(currentCol)
    let isValid = false

    // console.log('===> Move:', this.position, position)

    // A queen can move in vertically or horizontally any direction, any number of spaces
    if ((currentRow === nextRow) || (currentCol === nextCol)) {
      isValid = true
    }

    // A queen can move diagonally in any direction, any number of spaces
    if (Math.abs(nextColIndex - currentColIndex) === Math.abs(nextRow - currentRow)) {
      isValid = true
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      // Determine the delta and direction for the move
      const [ rowVector, colVector ] = getVectors(this.coords, nextCoords)
      const rowDelta = rowVector[1]
      const colDelta = colVector[1]

      // loop through the coords to walk from (current) => (next)
      if (colDelta > 0 && rowDelta > 0) {
        isValid = walkDiagonal(board, this.coords, nextCoords)
      } else {
        isValid = walk(board, this.coords, nextCoords)
      }

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
    return this.color === 'white' ? '\u2655' : '\u265b'
  }
}

module.exports = {
  Queen,
  wQ: (...a) => new Queen('white', ...a),
  bQ: (...a) => new Queen('black', ...a)
}
