import babel    from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve  from 'rollup-plugin-node-resolve';

let packageJson = require('./package.json');
let {'jsnext:main': jsnext, main} = packageJson;

export default {
  moduleName: 'aptivator',
  entry: 'src/aptivator.js',
  targets: [{
    format: 'umd',
    dest: main
  }, {
    format: 'es',
    dest: jsnext
  }],
  globals: {
    backbone: 'Backbone',
    'backbone.marionette': 'Marionette',
    jquery: '$',
    lodash: '_'
  },
  external: ['backbone', 'backbone.marionette', 'jquery', 'lodash'],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    })
  ]
};
