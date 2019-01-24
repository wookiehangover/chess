// import chalk from 'chalk'

const EMPTY_CELL = '---';
const ROWS = 'abcdefgh'.split('');
const COLS = '87654321'.split('');

const getRow = (board, row) => {
  const r = row - 1;
  return [
    board.a[r], board.b[r], board.c[r], board.d[r],
    board.e[r], board.f[r], board.g[r], board.h[r]
  ]
};

const coordsFromPosition = (position) => {
  const [ col, row ] = position.split('');
  return [ col, parseInt(row, 10) ]
};

const direction = (x, y) => x > y ? 1 : -1;

const size = (x, y) => x > y ? x - y : y - x;

const getVectors = ([ currentCol, currentRow ], [ nextCol, nextRow ]) => {
  const nextColIndex = ROWS.indexOf(nextCol);
  const currentColIndex = ROWS.indexOf(currentCol);

  const row = [
    direction(nextRow, currentRow),
    size(nextRow, currentRow)
  ];
  const col = [
    direction(nextColIndex, currentColIndex),
    size(nextColIndex, currentColIndex)
  ];

  return [ row, col ]
};

const printPiece = (piece) => {
  if (piece.color === 'white') {
    return piece
    // return chalk.white.bold(piece)
  } else {
    return piece
    // return chalk.gray.bold(piece)
  }
};

const printPieces = (board) => {
  const pieces = board.pieces.reduce((result, p) => {
    result[p.color].push(p.toChar());
    return result
  }, { black: [], white: [] });

  const black = pieces.black.sort().join(' ');
  const white = pieces.white.sort().join(' ');

  // console.log('w: ' + chalk.cyan(white))
  // console.log('b: ' + chalk.green(black))
};

const printRow = (board, i) => {
  const row = getRow(board, i).map(printPiece).join(' ');
  console.log(`${i}: ${row}`);
};

const printBoard = (board) => {
  if (board === false) {
    console.log('Invalid Board!');
    return
  }
  console.log('');
  COLS.forEach(col => printRow(board, col));
  console.log(`   ${ROWS.join('   ')}\n`);
  printPieces(board);
  console.log('');
};

class Board {
  constructor (pieces = []) {
    ROWS.forEach(col => {
      this[col] = new Array(8).fill(EMPTY_CELL, 0, 8);
    });

    pieces.forEach((piece) => {
      const [ col, row ] = piece.coords;
      this[col].splice(row - 1, 1, piece);
    });
  }

  get pieces () {
    return ROWS.map(r => this[r]).reduce((result, r) => {
      result.push.apply(result, r.filter(cell => cell !== EMPTY_CELL));
      return result
    }, [])
  }

  write (coords, value) {
    const [ col, row ] = coords;
    this[col].splice(row - 1, 1, value);
  }

  forEach (callback) {
    ROWS.forEach(row => {
      COLS.forEach(col => {
        callback.call(this, row + col, this.getPiece(row + col));
      });
    });
  }

  map (callback) {
    const result = [];
    this.forEach((position, piece) => {
      result.push(callback(position, piece));
    });
    return result
  }

  getPiece (position) {
    return getPiece(this, position)
  }

  walk (p1, p2) {
    return walk(this, p1, p2)
  }

  walkDiagonal (p1, p2) {
    return walkDiagonal(this, p1, p2)
  }
}

const createBoard = (pieces) => {
  return new Board(pieces)
};

const getPiece = (board, position) => {
  const [ col, row ] = coordsFromPosition(position);
  const piece = board[col][row - 1];

  if (piece && piece.color && piece.name) {
    return piece
  } else {
    return false
  }
};

const movePiece = (board, piece, position) => {
  const p = getPiece(board, piece);

  if (p === false) {
    return false
  }

  const move = p.move(board, position);

  if (move === true) {
    console.log(`${p.color}: ${piece} -> ${position}`);
  } else {
    console.log(`${piece}->${position} isn't a valid move!`);
    return false
  }

  return board
};

const walk = (board, [ currentCol, currentRow ], [ nextCol, nextRow ]) => {
  let isValid = true;
  // Determine the delta and direction for the move
  const [
    [ rowDirection, rowDelta ],
    [ colDirection, colDelta ]
  ] = getVectors([ currentCol, currentRow ], [ nextCol, nextRow ]);

  // loop through the coords to walk from (current) => (next)
  const spaces = colDelta + rowDelta;
  const currentColIndex = ROWS.indexOf(currentCol);
  for (let i = 1; i < spaces; i++) {
    // WARNING: clever code ahead!
    // Math.min({col,row}Delta, 1) = 0, when the value hasn't changed, e.g. row + (i * 0) = row
    const row = currentRow + (rowDirection * i * Math.min(rowDelta, 1));
    const col = ROWS[currentColIndex + (colDirection * i * Math.min(colDelta, 1))];
    const piece = getPiece(board, col + row);
    // console.log(`checking ${col}${row}...`, piece)
    if (piece) {
      isValid = false;
      break
    }
  }

  return isValid
};

const walkDiagonal = (board, [ currentCol, currentRow ], [ nextCol, nextRow ]) => {
  let isValid = true;
  // Determine the delta and direction for the move
  const [
    [ rowDirection, rowDelta ],
    [ colDirection, colDelta ]
  ] = getVectors([ currentCol, currentRow ], [ nextCol, nextRow ]);

  // loop through the coords to walk from (current) => (next)
  if (colDelta > 0 && rowDelta > 0) {
    // when both row and column values have changed, walk by incrementing x and y simultaneously
    const currentColIndex = ROWS.indexOf(currentCol);
    for (let x = 1, y = 1; x < rowDelta && y < colDelta; x++, y++) {
      const row = currentRow + (rowDirection * x);
      const col = ROWS[currentColIndex + (colDirection * y)];
      const piece = getPiece(board, col + row);
      // console.log(`checking ${row}${col}...`, piece)
      if (piece) {
        isValid = false;
        break
      }
    }
  }

  return isValid
};

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

class Piece {
  constructor (color, position) {
    this.color = color;
    this.position = position;
  }

  capture (piece) {
    console.log(`${this.color}: ${this.toChar()} ${this.position} takes ${piece.toChar()} ${piece.position}!`);
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
    const moves = [];
    board.forEach((position) => {
      if (this.move(board, position)) {
        moves.push(position);
      }
    });
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

class Pawn extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position);
    const [ currentCol, currentRow ] = this.coords;
    const [ nextCol, nextRow ] = nextCoords;
    const isOccupied = board[nextCol][nextRow - 1] !== EMPTY_CELL;
    let isValid = false;

    // console.log('Move:', this.position, position)

    // Pawns are confined to once space in a single direction
    const range = this.color === 'white' ? 1 : -1;
    const maxRow = currentRow + range;
    const validRow = maxRow === nextRow;

    // if the new space is occupied, it must be +/- one col and +1 row
    if (isOccupied) {
      // console.log('Taking Move:', this.position, position)
      const nextColIndex = ROWS.indexOf(nextCol);
      const currentColIndex = ROWS.indexOf(currentCol);

      // Pawns can only take pieces diagonally, 1 space in either direction
      const validCol = nextColIndex === currentColIndex - 1 || nextColIndex === currentColIndex + 1;

      if (validRow && validCol) {
        isValid = true;
      }
    } else {
      // Pawns must stay in the same colum
      const validCol = currentCol === nextCol;

      // Pawns can move 1 space
      if (validRow && validCol) {
        isValid = true;
      }

      // Opening moves can be 2 spaces in the same column
      const validOpener = (maxRow + range) === nextRow && validCol;

      // white can move 2 spaces if they are in row 2
      if (this.color === 'white' && validOpener && currentRow === 2) {
        isValid = true;
      }

      // black can move 2 spaces if they are in row 7
      if (this.color === 'black' && validOpener && currentRow === 7) {
        isValid = true;
      }

      if (isValid) {
        isValid = board.walk(this.coords, nextCoords);
      }
    }

    const piece = board.getPiece(position);
    if (piece !== false && isValid) {
      this.capture(piece);
    }

    return isValid
  }

  toString () {
    return ' ' + this.position
  }

  toChar () {
    return this.color === 'white' ? '\u2659' : '\u265f'
  }
}

const wP = (...a) => new Pawn('white', ...a);
const bP = (...a) => new Pawn('black', ...a);

var Pawn$1 = /*#__PURE__*/Object.freeze({
  Pawn: Pawn,
  wP: wP,
  bP: bP
});

class Rook extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position);
    const [ currentCol, currentRow ] = this.coords;
    const [ nextCol, nextRow ] = nextCoords;
    let isValid = false;

    // console.log('===> Move:', this.position, position); debugger

    // A Rook can move in vertically or horizontally any direction, any number of spaces
    if ((currentRow === nextRow) || (currentCol === nextCol)) {
      isValid = true;
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      isValid = board.walk(this.coords, nextCoords);

      // And if the final position is a capture, it's valid
      const piece = board.getPiece(position);
      if (piece !== false && isValid) {
        if (piece.color === this.color) {
          isValid = false;
        } else {
          isValid = true;
          this.capture(piece);
        }
      }
    }

    return isValid
  }

  toChar () {
    return this.color === 'white' ? '\u2656' : '\u265c'
  }
}

const wR = (...a) => new Rook('white', ...a);
const bR = (...a) => new Rook('black', ...a);

var Rook$1 = /*#__PURE__*/Object.freeze({
  Rook: Rook,
  wR: wR,
  bR: bR
});

const absProduct = (v) => Math.abs(v[0] * v[1]);

class Night extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position);
    let isValid = false;

    // console.log('===> Move:', this.position, position); debugger

    // knights can move 2 spaces in a {row, col}, followed by 1 spaces {col, row}
    const [ rowVector, colVector ] = getVectors(this.coords, nextCoords);
    const col = absProduct(colVector);
    const row = absProduct(rowVector);

    if ((col === 1 && row === 2) ||
        (col === 2 && row === 1)) {
      isValid = true;
    }

    const piece = board.getPiece(position);
    if (piece !== false && isValid) {
      if (piece.color === this.color) {
        isValid = false;
      } else {
        isValid = true;
        this.capture(piece);
      }
    }

    return isValid
  }

  get fullName () {
    return 'Knight'
  }

  toChar () {
    return this.color === 'white' ? '\u2658' : '\u265e'
  }
}

const wN = (...a) => new Night('white', ...a);
const bN = (...a) => new Night('black', ...a);

var Knight = /*#__PURE__*/Object.freeze({
  Night: Night,
  wN: wN,
  bN: bN
});

class Bishop extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position);
    const [ currentCol, currentRow ] = this.coords;
    const [ nextCol, nextRow ] = nextCoords;
    const nextColIndex = ROWS.indexOf(nextCol);
    const currentColIndex = ROWS.indexOf(currentCol);
    let isValid = false;

    // console.log('===> Move:', this.position, position); debugger

    // A bishop can move diagonally in any direction, any number of spaces
    if (Math.abs(nextColIndex - currentColIndex) === Math.abs(nextRow - currentRow)) {
      isValid = true;
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      // loop through the coords to walk from (current) => (next)
      isValid = board.walkDiagonal(this.coords, nextCoords);

      // And if the final position is a capture, it's valid
      const piece = board.getPiece(position);
      if (piece !== false && isValid) {
        if (piece.color === this.color) {
          isValid = false;
        } else {
          isValid = true;
          this.capture(piece);
        }
      }
    }

    return isValid
  }

  toChar () {
    return this.color === 'white' ? '\u2657' : '\u265d'
  }
}

const wB = (...a) => new Bishop('white', ...a);

const bB = (...a) => new Bishop('black', ...a);

var Bishop$1 = /*#__PURE__*/Object.freeze({
  Bishop: Bishop,
  wB: wB,
  bB: bB
});

class Queen extends Piece {
  move (board, position) {
    const nextCoords = coordsFromPosition(position);
    const [ currentCol, currentRow ] = this.coords;
    const [ nextCol, nextRow ] = nextCoords;
    const nextColIndex = ROWS.indexOf(nextCol);
    const currentColIndex = ROWS.indexOf(currentCol);
    let isValid = false;

    // console.log('===> Move:', this.position, position)

    // A queen can move in vertically or horizontally any direction, any number of spaces
    if ((currentRow === nextRow) || (currentCol === nextCol)) {
      isValid = true;
    }

    // A queen can move diagonally in any direction, any number of spaces
    if (Math.abs(nextColIndex - currentColIndex) === Math.abs(nextRow - currentRow)) {
      isValid = true;
    }

    // if the move may be legal, check that the path is unobstructed
    if (isValid) {
      // Determine the delta and direction for the move
      const [ rowVector, colVector ] = getVectors(this.coords, nextCoords);
      const rowDelta = rowVector[1];
      const colDelta = colVector[1];

      // loop through the coords to walk from (current) => (next)
      if (colDelta > 0 && rowDelta > 0) {
        isValid = board.walkDiagonal(this.coords, nextCoords);
      } else {
        isValid = board.walk(this.coords, nextCoords);
      }

      // And if the final position is a capture, it's valid
      const piece = board.getPiece(position);
      if (piece !== false && isValid) {
        if (piece.color === this.color) {
          isValid = false;
        } else {
          isValid = true;
          this.capture(piece);
        }
      }
    }

    return isValid
  }

  toChar () {
    return this.color === 'white' ? '\u2655' : '\u265b'
  }
}

const wQ = (...a) => new Queen('white', ...a);
const bQ = (...a) => new Queen('black', ...a);

var Queen$1 = /*#__PURE__*/Object.freeze({
  Queen: Queen,
  wQ: wQ,
  bQ: bQ
});

class King extends Piece {
  move (board, position) {
    return false
  }

  toChar () {
    return this.color === 'white' ? '\u2654' : '\u265a'
  }
}

const wK = (...a) => new King('white', ...a);
const bK = (...a) => new King('black', ...a);

var King$1 = /*#__PURE__*/Object.freeze({
  King: King,
  wK: wK,
  bK: bK
});

const pieces = {
  ...Pawn$1,
  ...Rook$1,
  ...Knight,
  ...Bishop$1,
  ...Queen$1,
  ...King$1
};

const {
  wP: wP$1, bP: bP$1,
  wR: wR$1, bR: bR$1,
  wN: wN$1, bN: bN$1,
  wB: wB$1, bB: bB$1,
  wQ: wQ$1, bQ: bQ$1,
  wK: wK$1, bK: bK$1
} = pieces;

// Let's Play

const defaultPieces = [
  bR$1('a8'), bN$1('b8'), bB$1('c8'), bQ$1('d8'), bK$1('e8'), bB$1('f8'), bN$1('g8'), bR$1('h8'),
  bP$1('a7'), bP$1('b7'), bP$1('c7'), bP$1('d7'), bP$1('e7'), bP$1('f7'), bP$1('g7'), bP$1('h7'),
  wP$1('a2'), wP$1('b2'), wP$1('c2'), wP$1('d2'), wP$1('e2'), wP$1('f2'), wP$1('g2'), wP$1('h2'),
  wR$1('a1'), wN$1('b1'), wB$1('c1'), wQ$1('d1'), wK$1('e1'), wB$1('f1'), wN$1('g1'), wR$1('h1')
];

class Game extends EventEmitter {
  constructor (pieces$$1 = defaultPieces) {
    super();
    this.history = [];
    this.pieces = pieces$$1;
    this.board = createBoard(pieces$$1);
    this.on('move', printBoard);
    printBoard(this.board);
  }

  get lastMove () {
    return this.history[this.history.length - 1]
  }

  get nextMove () {
    if (this.history.length === 0) {
      return 'white'
    } else {
      return this.board.getPiece(this.lastMove[2]).color === 'white' ? 'black' : 'white'
    }
  }

  update (piece, position) {
    this.history.push([
      this.pieces.map(p => p.clone()),
      piece,
      position
    ]);
  }

  move (piece, position) {
    const p = getPiece(this.board, piece);
    let board = movePiece(this.board, piece, position);

    if (p.color !== this.nextMove) {
      board = false;
      console.log(`Slow down there. It's ${this.nextMove}'s turn.`);
    }

    if (board !== false) {
      // Add this move to history, taking a snapshot of the board prior to moving anything
      this.update(piece, position);
      // Replace the piece with an empty cell
      board.write(p.coords, EMPTY_CELL);
      // Move the piece to its new position
      board.write(coordsFromPosition(position), p);
      // Finally, make sure the piece knows its new position
      p.position = position;
    }

    this.emit('move', board);
    return this.board
  }
}

let game = new Game();

game.move('e2', 'e4');

export { Game, game };
