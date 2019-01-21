const Piece = require('./piece')
const { coordsFromPosition, EMPTY_CELL, ROWS } = require('../utils')
const { getPiece } = require('../board')

class Queen extends Piece {
  move (board, position) {
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = coordsFromPosition(position)
    let isValid = false

    console.log('===> Move:', this.position, position)

    // A queen can move in vertically or horizontally any direction, any number of spaces
    if ((currentRow === nextRow) || (currentCol === nextCol)) {
      isValid = true
    }

    // A queen can move diagonally in any direction, any number of spaces
    if (Math.abs(nextCol - currentCol) === Math.abs(nextRow - currentRow)) {
      isValid = true
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      let x = Math.abs(nextRow - currentRow)
      // console.log(nextRow, currentRow)
      // for (let i = 0; i < x; i++) {
      //   console.log(i, x)
      // }

      // And if the final position is a capture, it's valid
      const piece = getPiece(board, position)
      if (piece && piece.color !== this.color) {
        isValid = false
      } else if (piece !== false) {
        this.capture(piece)
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
