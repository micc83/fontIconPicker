/**
 * Light weight wrapper to inject fontIconPicker
 * into jQuery.fn
 */
import { FontIconPicker } from './FontIconPicker.js';

function fontIconPickerShim( $ ) {
	$.fn.fontIconPicker = function( options ) {

		// Instantiate the plugin
		this.each( function() {
			if ( ! $.data( this, 'fontIconPicker' ) ) {
				$.data( this, 'fontIconPicker', new FontIconPicker( this, options ) );
			}
		} );

		// setIcons method
		this.setIcons = ( newIcons = false, iconSearch = false ) => {
			this.each( function() {
				$.data( this, 'fontIconPicker' ).setIcons( newIcons, iconSearch );
			} );
		};

		// setIcon method
		this.setIcon = ( newIcon = '' ) => {
			this.each( function() {
				$.data( this, 'fontIconPicker' ).setIcon( newIcon );
			} );
		};

		// destroy method
		this.destroyPicker = () => {
			this.each( function() {
				if ( ! $.data( this, 'fontIconPicker' ) ) {
					return;
				}

				// Remove the iconPicker
				$.data( this, 'fontIconPicker' ).destroy();

				// destroy data
				$.removeData( this, 'fontIconPicker' );
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
				if ( ! $.data( this, 'fontIconPicker' ) ) {
					$.data( this, 'fontIconPicker', new FontIconPicker( this, newOptions ) );
				}
			} );
		};

		// reposition method
		this.repositionPicker = () => {
			this.each( function() {
				$.data( this, 'fontIconPicker' ).resetPosition();
			} );
		};

		return this;
	};

	return $;
}

export default function initFontIconPicker( jQuery ) {
	fontIconPickerShim( jQuery );
	return true;
}
