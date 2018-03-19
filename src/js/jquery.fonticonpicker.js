/**
 *  jQuery fontIconPicker - v2.1.1
 *
 *  An icon picker built on top of font icons and jQuery
 *
 *  http://codeb.it/fontIconPicker
 *
 *  Made by Alessandro Benoit & Swashata
 *  Under MIT License
 *
 * {@link https://github.com/micc83/fontIconPicker}
 */
import $ from 'jquery';
import { FontIconPicker } from 'modules/plugin.js';

'use strict';

// Lightweight plugin wrapper
$.fn.fontIconPicker = function (options) {

	// Instantiate the plugin
	this.each(function () {
		if (!$.data(this, "fontIconPicker")) {
			$.data(this, "fontIconPicker", new Plugin(this, options));
		}
	});

	// setIcons method
	this.setIcons = $.proxy(function (newIcons, iconSearch) {
		if ( undefined === newIcons ) {
			newIcons = false;
		}
		if ( undefined === iconSearch ) {
			iconSearch = false;
		}
		this.each(function () {
			$.data(this, "fontIconPicker").settings.source = newIcons;
			$.data(this, "fontIconPicker").settings.searchSource = iconSearch;
			$.data(this, "fontIconPicker").initSourceIndex();
			$.data(this, "fontIconPicker").resetSearch();
			$.data(this, "fontIconPicker").loadIcons();
		});
	}, this);

	// destroy method
	this.destroyPicker = $.proxy(function() {
		this.each(function() {
			if (!$.data(this, "fontIconPicker")) {
				return;
			}
			// Remove the iconPicker
			$.data(this, "fontIconPicker").iconPicker.remove();
			// Reset the CSS
			$.data(this, "fontIconPicker").element.css({
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
			});

			// destroy data
			$.removeData(this, "fontIconPicker");
		});
	}, this);

	// reInit method
	this.refreshPicker = $.proxy(function(newOptions) {
		if ( ! newOptions ) {
			newOptions = options;
		}
		// First destroy
		this.destroyPicker();

		// Now reset
		this.each(function() {
			if (!$.data(this, "fontIconPicker")) {
				$.data(this, "fontIconPicker", new Plugin(this, newOptions));
			}
		});
	}, this);

	return this;
};
