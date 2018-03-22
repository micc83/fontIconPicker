/**
 *  jQuery fontIconPicker
 *
 *  An icon picker built on top of font icons and jQuery
 *
 *  http://codeb.it/fontIconPicker
 *
 *  Made by Alessandro Benoit & Swashata
 *  Licensed under MIT License
 *
 * {@link https://github.com/micc83/fontIconPicker}
 */
import jQuery from 'jquery';
import initFontIconPicker from './modules/initFontIconPicker.js';

// Safely init the plugin
// In browser this will work
// But in node environment it might not.
// because if jQu
if ( jQuery && jQuery.fn ) {
	initFontIconPicker( jQuery );
}

// Export the function anyway, so that it can be initiated
// from node environment
export default ( jQuery ) => initFontIconPicker( jQuery );

