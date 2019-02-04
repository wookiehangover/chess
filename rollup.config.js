// rollup.config.js
// import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/browser/index.js',
  output: {
    file: 'public/bundle.mjs',
    format: 'esm'
  },
  plugins: [
    nodeResolve({
      jsnext: false,
      main: true,
      preferBuiltins: true
    }),

    // commonjs({
    //   include: 'node_modules/**',
    //   // if false then skip sourceMap generation for CommonJS modules
    //   sourceMap: false
    // }),

    builtins(),

    terser()
  ]
}
