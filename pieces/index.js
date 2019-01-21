const { ...Pawn } = require('./pawn')
const { ...Rook } = require('./rook')
const { ...Knight } = require('./knight')
const { ...Bishop } = require('./bishop')
const { ...Queen } = require('./queen')
const { ...King } = require('./king')

module.exports = {
  ...Pawn,
  ...Rook,
  ...Knight,
  ...Bishop,
  ...Queen,
  ...King
}
