import buble        from 'rollup-plugin-buble';
import commonjs     from 'rollup-plugin-commonjs';
import resolver     from 'rollup-plugin-node-resolve';
import underscorify from 'rollup-plugin-underscorify';

export default {
  entry: './src/js/app.js',
  plugins: [
    underscorify(),
    commonjs(),
    resolver(),
    buble()
  ],
  dest: './src/js/_app.js',
  format: 'iife',
  moduleName: 'aptivator-example'
};
