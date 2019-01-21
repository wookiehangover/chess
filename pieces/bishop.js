const Piece = require('./piece')

class Bishop extends Piece {
  toChar () {
    return this.color === 'white' ? '\u2657' : '\u265d'
  }
}

module.exports = {
  Bishop,
  wB: (...a) => new Bishop('white', ...a),
  bB: (...a) => new Bishop('black', ...a)
}
