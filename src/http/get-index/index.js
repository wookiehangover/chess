// src/http/get-index
let getURL = require('./get-web-socket-url')
let arc = require('@architect/functions')

/**
 * renders the html app chrome
 */
exports.handler = async function http(req) {
  let js = 'https://s3-us-west-2.amazonaws.com/chessbot-staging-1234/bundle.mjs'
  return {
    type: 'text/html; charset=utf8',
    body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chess</title>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
  <script>
  window.WS_URL = '${getURL()}'
  </script>
  <script type="module" src="${js}"></script>
</head>

<body>
  <style>
    :root {
      --cell-size: 4rem;
      --font-size: 3rem;
      --columns: var(--cell-size) var(--cell-size) var(--cell-size) var(--cell-size) var(--cell-size) var(--cell-size) var(--cell-size) var(--cell-size);
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    .wrapper {
      display: flex;
      flex-wrap: wrap;
      max-width: 800px;
    }

    .row-labels {
      display: grid;
      grid-template-columns: var(--cell-size);
      grid-gap: 0.5rem;
      padding: 0.5rem;
    }

    .row-labels h2 {
      text-align: center;
      padding-top: calc(var(--cell-size) / 5);
      margin: 0.5rem;
    }

    .col-labels {
      display: grid;
      grid-template-columns: var(--columns);
      grid-gap: 0.5rem;
      padding: 0.5rem;
      margin-left: calc(var(--cell-size) + 1rem);
    }

    .col-labels h2 {
      width: var(--cell-size);
      height: var(--cell-size);
      text-align: center;
    }

    #board {
      display: grid;
      grid-template-columns: var(--columns);
      grid-gap: 0.5rem;
      padding: 0.5rem;
    }

    .cell {
      width: var(--cell-size);
      height: var(--cell-size);
      border: 1px solid black;
      background: paleturquoise;
      text-align: center;
    }

    .cell a {
      font-size: var(--font-size);
    }

    .cell a.selected {
      color: magenta;
    }

    .cell:nth-of-type(16n + 2),
    .cell:nth-of-type(16n + 4),
    .cell:nth-of-type(16n + 6),
    .cell:nth-of-type(16n + 9),
    .cell:nth-of-type(16n + 11),
    .cell:nth-of-type(16n + 13),
    .cell:nth-of-type(16n + 15),
    .cell:nth-of-type(16n - 8) {
      background: white;
    }

    .cell.valid {
      background: bisque;
    }

    @media screen and (max-width: 420px) {
      :root {
        --cell-size: 2.2rem;
        --font-size: 1.6rem;
      }
      .row-labels, .col-labels {
        display: none;
      }
      .wrapper {
        justify-content: center;
      }
    }
    @media screen and (min-width: 420px) {
      .wrapper {
        padding: 1rem;
      }
    }
  </style>
  <div class="wrapper">
    <div class="row-labels">
      <h2>8</h2>
      <h2>7</h2>
      <h2>6</h2>
      <h2>5</h2>
      <h2>4</h2>
      <h2>3</h2>
      <h2>2</h2>
      <h2>1</h2>
    </div>
    <div id="board">
      <div v-for="(piece, position) in board" class="cell" v-bind:class="isValid(position)" v-on:click="selectPiece(position)">
        <a :name="piece.position" v-if="piece" v-bind:class="isSelected(position)">{{piece.toChar()}}</a>
      </div>
    </div>
    <div class="col-labels">
      <h2>a</h2>
      <h2>b</h2>
      <h2>c</h2>
      <h2>d</h2>
      <h2>e</h2>
      <h2>f</h2>
      <h2>g</h2>
      <h2>h</h2>
    </div>
  </div>
  <div id="controls">
    <input v-model="connectionId" />
  </div>
</body>

</html>
`
  }
}