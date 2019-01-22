const Piece = require('./piece')

class King extends Piece {
  move (board, position) {
    return false
  }

  toChar () {
    return this.color === 'white' ? '\u2654' : '\u265a'
  }
}

module.exports = {
  King,
  wK: (...a) => new King('white', ...a),
  bK: (...a) => new King('black', ...a)
}
