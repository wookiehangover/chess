const { coordsFromPosition } = require('../utils')

module.exports = class Piece {
  constructor (color, position) {
    this.color = color
    this.position = position
  }

  capture (piece) {
    console.log(`${this.color}: ${this.toChar()} ${this.position} takes ${piece.toChar()} ${piece.position}!`)
  }

  get coords () {
    return coordsFromPosition(this.position)
  }

  get name () {
    return this.constructor.name.substr(0, 1)
  }

  get fullName () {
    return this.constructor
  }

  toString () {
    return this.name + this.position
  }

  move (board, position) {
    throw new Error('Not implemented!')
  }

  clone () {
    return new this.constructor(this.color, this.position)
  }
}
