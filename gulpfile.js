// Init gulp
const gulp = require( 'gulp' );

// Init sourcemaps
const sourcemaps = require( 'gulp-sourcemaps' );

// Init rename
const rename = require( 'gulp-rename' );

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
	},
	fonts: {
		src: 'src/fonts/**/*.*',
		dest: 'dist/fonts'
	},
	demo: {
		src: 'demo/**/*.*'
	}
};

// Create an instance for browsersync
const browserSync = require( 'browser-sync' );
const server = browserSync.create();

// Function to serve
const serve = ( done ) => {
	server.init( {
		server: {
			baseDir: 'demo',
			routes: {
				'/dist': 'dist'
			}
		},
		notify: true
	} );
	done();
};

// Function to reload browser
const reload = ( done ) => {
	server.reload();
	done();
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
const scripts = ( environment = 'development' ) => {
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
				name: 'initFontIconPickerNode',
				banner: `
/**
 *  jQuery fontIconPicker - ${pkg.version}
 *
 *  An icon picker built on top of font icons and jQuery
 *
 *  http://codeb.it/fontIconPicker
 *
 *  @author Alessandro Benoit & Swashata Ghosh
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
gulp.task( 'scripts:dev', () => scripts( 'development' ) );
gulp.task( 'scripts:prod', () => scripts( 'production' ) );

// Create CSS from SCSS
const sass = require( 'gulp-sass' );
const postcss = require( 'gulp-postcss' );
const autoPrefixer = require( 'autoprefixer' );
const cssnano = require( 'cssnano' );
const postCSSBanner = require( 'postcss-banner' );

// Build Styles
const styles = () => {
	const plugins = [
		autoPrefixer( {
			browsers: [ 'last 2 versions' ]
		} ),
		cssnano( {
			preset: 'default',
			reduceIdents: false,
			zindex: false,
			mergeIdents: false,
			discardUnused: false
		} ),
		postCSSBanner( {
			banner: `CSS files for fontIconPicker

@license MIT
@version ${pkg.version}
{@link https://github.com/micc83/fontIconPicker}
`,
			important: true
		} )
	];
	return gulp.src( paths.styles.src )
		.pipe( sourcemaps.init() )
			.pipe( sass().on( 'error', sass.logError ) ) // eslint-disable-line
			.pipe( postcss( plugins ) ) // eslint-disable-line
		.pipe( sourcemaps.write( './' ) )
		.pipe( rename( path => {
			if ( '.css' === path.extname ) {
				path.extname = '.min.css';
			}
		} ) )
		.pipe( gulp.dest( paths.styles.dest ) )
		.pipe( server.stream() );
};

// styles task
gulp.task( 'styles', styles );

// Copy fonts
const fonts = () => {
	return gulp.src( paths.fonts.src )
		.pipe( gulp.dest( paths.fonts.dest ) );
};

// fonts task
gulp.task( 'fonts', fonts );

// Watch function
const watch = () => {

	// Watch scripts
	gulp.watch( paths.scripts.all, gulp.series( gulp.parallel( 'scripts:dev', 'scripts:prod' ), reload ) );

	// Watch styles - TODO
	gulp.watch( paths.styles.src, gulp.series( styles ) );

	// Watch demo files
	gulp.watch( paths.demo.src, gulp.series( reload ) );
};

gulp.task( 'serve', gulp.series( clean, gulp.parallel( 'scripts:dev', 'scripts:prod', styles, fonts ), serve, watch ) );

// build task
const build = gulp.series( clean, gulp.parallel( 'scripts:dev', 'scripts:prod', styles, fonts ) );
gulp.task( 'build', build );
gulp.task( 'default', build );

// Linting and testing
const esLint = require( 'gulp-eslint' );
const lintScripts = () => {
	return gulp.src( paths.scripts.all )
		.pipe( esLint( {
			useEslintrc: true
		} ) )
		.pipe( esLint.format() )
		.pipe( esLint.failAfterError() );
};
gulp.task( 'lint:script', lintScripts );

const styleLint = require( 'gulp-stylelint' );
const lintStyles = () => {
	return gulp.src( paths.styles.src )
		.pipe( styleLint( {
			failAfterError: true,
			reporters: [
				{
					formatter: 'verbose',
					console: true
				}
			]
		} ) );
};
gulp.task( 'lint:style', lintStyles );

// Combine
gulp.task( 'lint', gulp.series( 'lint:style', 'lint:script' ) );
