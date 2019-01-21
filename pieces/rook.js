const Piece = require('./piece')

class Rook extends Piece {
  toChar () {
    return this.color === 'white' ? '\u2656' : '\u265c'
  }
}

module.exports = {
  Rook,
  wR: (...a) => new Rook('white', ...a),
  bR: (...a) => new Rook('black', ...a)
}
