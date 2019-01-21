const Piece = require('./piece')
const { coordsFromPosition, EMPTY_CELL, ROWS } = require('../utils')
const { getPiece } = require('../board')

class Pawn extends Piece {
  move (board, position) {
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = coordsFromPosition(position)
    const isOccupied = board[nextCol][nextRow - 1] !== EMPTY_CELL
    let isValid = false

    // console.log('Move:', this.position, position)

    // Pawns are confined to once space in a single direction
    const range = this.color === 'white' ? 1 : -1
    const maxRow = currentRow + range
    const validRow = maxRow === nextRow

    // if the new space is occupied, it must be +/- one col and +1 row
    if (isOccupied) {
      // console.log('Taking Move:', this.position, position)
      const nextColIndex = ROWS.indexOf(nextCol)
      const currentColIndex = ROWS.indexOf(currentCol)

      // Pawns can only take pieces diagonally, 1 space in either direction
      const validCol = nextColIndex === currentColIndex - 1 || nextColIndex === currentColIndex + 1

      if (validRow && validCol) {
        this.capture(getPiece(board, position))
        isValid = true
      }
    } else {
      // Pawns must stay in the same colum
      const validCol = currentCol === nextCol

      // Pawns can move 1 space
      if (validRow && validCol) {
        isValid = true
      }

      // Opening moves can be 2 spaces in the same column
      const validOpener = (maxRow + range) === nextRow && validCol

      // white can move 2 spaces if they are in row 2
      if (this.color === 'white' && validOpener && currentRow === 2
      ) {
        isValid = true
      }

      // black can move 2 spaces if they are in row 7
      if (this.color === 'black' && validOpener && currentRow === 7
      ) {
        isValid = true
      }
    }

    return isValid
  }

  toString () {
    return ' ' + this.position
  }

  toChar () {
    return this.color === 'white' ? '\u2659' : '\u265f'
  }
}

module.exports = {
  Pawn,
  wP: (...a) => new Pawn('white', ...a),
  bP: (...a) => new Pawn('black', ...a)
}
