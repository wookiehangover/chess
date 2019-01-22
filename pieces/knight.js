const Piece = require('./piece')
const { coordsFromPosition, getVectors } = require('../utils')

const absProduct = (v) => Math.abs(v[0] * v[1])

class Night extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position)
    let isValid = false

    // console.log('===> Move:', this.position, position); debugger

    // knights can move 2 spaces in a {row, col}, followed by 1 spaces {col, row}
    const [ rowVector, colVector ] = getVectors(this.coords, nextCoords)
    const col = absProduct(colVector)
    const row = absProduct(rowVector)

    if ((col === 1 && row === 2) ||
        (col === 2 && row === 1)) {
      isValid = true
    }

    const piece = board.getPiece(position)
    if (piece !== false && isValid) {
      if (piece.color === this.color) {
        isValid = false
      } else {
        isValid = true
        this.capture(piece)
      }
    }

    return isValid
  }

  get fullName () {
    return 'Knight'
  }

  toChar () {
    return this.color === 'white' ? '\u2658' : '\u265e'
  }
}

module.exports = {
  Night,
  wN: (...a) => new Night('white', ...a),
  bN: (...a) => new Night('black', ...a)
}
