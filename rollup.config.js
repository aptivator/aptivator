import babel    from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve  from 'rollup-plugin-node-resolve';
//import uglify   from 'rollup-plugin-uglify';

export default {
  moduleName: 'aptivator',
  entry: 'src/aptivator.js',
  dest: 'dist/aptivator.js',
  format: 'umd',
  globals: {
    backbone: 'Backbone',
    jquery: '$',
    lodash: '_',
    'backbone.marionette': 'Marionette'
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
      exclude: "node_modules/**"
    }),
    //uglify()
  ]
};
