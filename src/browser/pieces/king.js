import Piece from './piece'
import { coordsFromPosition, getVectors } from '../utils'

const absProduct = (v) => Math.abs(v[0] * v[1])

class King extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position)
    let isValid = false

    // console.log('===> Move:', this.position, position); debugger

    // kings can move 1 space in any direction
    const [ rowVector, colVector ] = getVectors(this.coords, nextCoords)
    const col = absProduct(colVector)
    const row = absProduct(rowVector)

    if (row <= 1 && col <= 1) {
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

  toChar () {
    return this.color === 'white' ? '\u2654' : '\u265a'
  }
}

const wK = (...a) => new King('white', ...a)
const bK = (...a) => new King('black', ...a)

export {
  King,
  wK,
  bK
}
