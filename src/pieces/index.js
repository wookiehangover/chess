import * as Pawn from './pawn'
import * as Rook from './rook'
import * as Knight from './knight'
import * as Bishop from './bishop'
import * as Queen from './queen'
import * as King from './king'

const pieces = {
  ...Pawn,
  ...Rook,
  ...Knight,
  ...Bishop,
  ...Queen,
  ...King
}

export default pieces
