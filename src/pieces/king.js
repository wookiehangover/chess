import Piece from './piece'

class King extends Piece {
  move (board, position) {
    return false
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
