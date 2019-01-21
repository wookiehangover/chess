const Piece = require('./piece')

class King extends Piece {
  toChar () {
    return this.color === 'white' ? '\u2654' : '\u265a'
  }
}

module.exports = {
  King,
  wK: (...a) => new King('white', ...a),
  bK: (...a) => new King('black', ...a)
}
