const Piece = require('./piece')

class Night extends Piece {
  toChar () {
    return this.color === 'white' ? '\u2658' : '\u265e'
  }
}

module.exports = {
  Night,
  wN: (...a) => new Night('white', ...a),
  bN: (...a) => new Night('black', ...a)
}
