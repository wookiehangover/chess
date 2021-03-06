import { coordsFromPosition } from '../utils'

export default class Piece {
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
    return this.constructor.name
  }

  validMoves (board) {
    const moves = []
    board.forEach((position) => {
      if (this.move(board, position)) {
        moves.push(position)
      }
    })
    return moves
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
