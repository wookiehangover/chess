import Piece from './piece'
import { coordsFromPosition, ROWS } from '../utils'

class Bishop extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position)
    const [ currentCol, currentRow ] = this.coords
    const [ nextCol, nextRow ] = nextCoords
    const nextColIndex = ROWS.indexOf(nextCol)
    const currentColIndex = ROWS.indexOf(currentCol)
    let isValid = false

    // console.log('===> Move:', this.position, position); debugger

    // A bishop can move diagonally in any direction, any number of spaces
    if (Math.abs(nextColIndex - currentColIndex) === Math.abs(nextRow - currentRow)) {
      isValid = true
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      // loop through the coords to walk from (current) => (next)
      isValid = board.walkDiagonal(this.coords, nextCoords)

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
    return this.color === 'white' ? '\u2657' : '\u265d'
  }
}

const wB = (...a) => new Bishop('white', ...a)

const bB = (...a) => new Bishop('black', ...a)

export {
  Bishop,
  wB,
  bB
}
