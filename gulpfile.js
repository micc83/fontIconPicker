// Init gulp
const gulp = require( 'gulp' );

// Get package information
const pkg = require( './package.json' );

// Define environment
const environment = 'production' === process.env.NODE_ENV ? 'production' : 'development';

// Our paths
const paths = {
	scripts: {
		src: 'src/js/jquery.fonticonpicker.js',
		all: 'src/js/**/*.js',
		dest: 'dist/js'
	},
	styles: {
		src: 'src/scss/**/*.scss',
		dest: 'dist/css'
	}
};

// Clean function
const del = require( 'del' );
const clean = () => del( [ 'dist' ] );

// Get all rollup related things
const rollup = require( 'rollup' );
const rollupNodeResolve = require( 'rollup-plugin-node-resolve' );
const rollUpBabel = require( 'rollup-plugin-babel' );
const rollUpUglify = require( 'rollup-plugin-uglify' );

// 1. Build main JS
const scripts = () => {
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
		input: paths.scripts.src,
		external: [ 'jquery' ],
		plugins
	} )
		.then( bundle => {
			return bundle.write( {
				file: `${paths.scripts.dest}/${file}`,
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
};

// The rollup task
gulp.task( 'rollup', scripts );

// Create an instance for browsersync
const browserSync = require( 'browser-sync' );
const server = browserSync.create();

// Function to serve
const serve = ( done ) => {
	server.init( {
		server: {
			baseDir: 'demo',
			routes: {
				'/dist': 'dist',
				'/css': 'css',
				'/themes': 'themes'
			}
		}
	} );
	done();
};

// Function to reload browser
const reload = ( done ) => {
	server.reload();
	done();
};


// Watch function
const watch = () => {

	// Watch scripts
	gulp.watch( paths.scripts.all, gulp.series( scripts, reload ) );

	// Watch styles - TODO
};

gulp.task( 'serve', gulp.series( clean, scripts, /** styles, */ serve, watch ) );

