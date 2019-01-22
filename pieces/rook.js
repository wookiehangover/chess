const Piece = require('./piece')
const { coordsFromPosition } = require('../utils')

class Rook extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position)
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = nextCoords
    let isValid = false

    // console.log('===> Move:', this.position, position); debugger

    // A Rook can move in vertically or horizontally any direction, any number of spaces
    if ((currentRow === nextRow) || (currentCol === nextCol)) {
      isValid = true
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      isValid = board.walk(this.coords, nextCoords)

      // And if the final position is a capture, it's valid
      const piece = board.getPiece(position)
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
    return this.color === 'white' ? '\u2656' : '\u265c'
  }
}

module.exports = {
  Rook,
  wR: (...a) => new Rook('white', ...a),
  bR: (...a) => new Rook('black', ...a)
}
