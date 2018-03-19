// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/js/jquery.fonticonpicker.js',
	output: {
		file: 'dist/jquery.fonticonpicker.js',
		format: 'umd',
		globals: {
			jquery: 'jQuery'
		}
	},
	external: [ 'jquery' ],
	plugins: [
		resolve(),
		babel( {
			exclude: 'node_modules/**' // only transpile our source code
		} )
	]
};
