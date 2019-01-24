// rollup.config.js
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'

export default {
  input: 'browser.js',
  output: {
    file: 'dist/bundle.mjs',
    format: 'esm'
  },
  plugins: [
    nodeResolve({
      jsnext: false,
      main: true
    }),

    commonjs({
      include: 'node_modules/**',
      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false
    }),

    builtins()
  ]
}
