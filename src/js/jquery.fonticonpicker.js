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
import { FontIconPicker } from './modules/plugin.js';
import jQuery from 'jquery';

'use strict';

// Lightweight plugin wrapper
jQuery.fn.fontIconPicker = function( options ) {

	// Instantiate the plugin
	this.each( function() {
		if ( ! jQuery.data( this, 'fontIconPicker' ) ) {
			jQuery.data( this, 'fontIconPicker', new FontIconPicker( this, options ) );
		}
	} );

	// setIcons method
	this.setIcons = ( newIcons, iconSearch ) => {
		if ( undefined === newIcons ) {
			newIcons = false;
		}
		if ( undefined === iconSearch ) {
			iconSearch = false;
		}
		this.each( function() {
			jQuery.data( this, 'fontIconPicker' ).settings.source = newIcons;
			jQuery.data( this, 'fontIconPicker' ).settings.searchSource = iconSearch;
			jQuery.data( this, 'fontIconPicker' ).initSourceIndex();
			jQuery.data( this, 'fontIconPicker' ).resetSearch();
			jQuery.data( this, 'fontIconPicker' ).loadIcons();
		} );
	};

	// destroy method
	this.destroyPicker = () => {
		this.each( function() {
			if ( ! jQuery.data( this, 'fontIconPicker' ) ) {
				return;
			}

			// Remove the iconPicker
			jQuery.data( this, 'fontIconPicker' ).iconPicker.remove();

			// Reset the CSS
			jQuery.data( this, 'fontIconPicker' ).element.css( {
				visibility: '',
				top: '',
				position: '',
				zIndex: '',
				left: '',
				display: '',
				height: '',
				width: '',
				padding: '',
				margin: '',
				border: '',
				verticalAlign: '',
				float: ''
			} );

			// destroy data
			jQuery.removeData( this, 'fontIconPicker' );
		} );
	};

	// reInit method
	this.refreshPicker = ( newOptions ) => {
		if ( ! newOptions ) {
			newOptions = options;
		}

		// First destroy
		this.destroyPicker();

		// Now reset
		this.each( function() {
			if ( ! jQuery.data( this, 'fontIconPicker' ) ) {
				jQuery.data( this, 'fontIconPicker', new FontIconPicker( this, newOptions ) );
			}
		} );
	};

	return this;
};
