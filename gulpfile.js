// Init gulp
const gulp = require( 'gulp' );

// Get all rollup related things
const rollup = require( 'rollup' );
const rollupNodeResolve = require( 'rollup-plugin-node-resolve' );
const rollUpBabel = require( 'rollup-plugin-babel' );
const rollUpUglify = require( 'rollup-plugin-uglify' );

// Get package information
const pkg = require( './package.json' );

const environment = 'production' === process.env.NODE_ENV ? 'production' : 'development';

// 1. Build main JS
function scripts() {
	const plugins = [
		rollupNodeResolve(),
		rollUpBabel( {
			exclude: 'node_modules/**' // only transpile our source code
		} )
	];
	let sourcemap = true;
	let file = 'jquery.fonticonpicker.js';
	if ( 'production' === environment ) {
		plugins.push( rollUpUglify( {
			output: {
				comments: ( node, comment ) => {
					const text = comment.value;
					const type = comment.type;
					if ( 'comment2' == type ) {
						return /@preserve|@license|@cc_on/i.test( text );
					}
				}
			}
		} ) );
		sourcemap = false;
		file = 'jquery.fonticonpicker.min.js';
	}
	return rollup.rollup( {
		input: 'src/js/jquery.fonticonpicker.js',
		external: [ 'jquery' ],
		plugins
	} )
		.then( bundle => {
			return bundle.write( {
				file: `dist/${file}`,
				format: 'umd',
				globals: {
					jquery: 'jQuery'
				},
				banner: `
/**
 *  jQuery fontIconPicker - ${pkg.version}
 *
 *  An icon picker built on top of font icons and jQuery
 *
 *  http://codeb.it/fontIconPicker
 *
 *  @author Alessandro Benoit & Swashata
 *  @license MIT License
 *
 * {@link https://github.com/micc83/fontIconPicker}
 */
				`,
				sourcemap
			} );
		} );
}
gulp.task( 'rollup', scripts );
