/**
 * fontIconPicker Plugin Class
 */

import defaults from './defaults.js';
import jQuery from 'jquery';

'use strict';

const $ = jQuery;
function FontIconPicker( element, options ) {
	this.element = $( element );
	this.settings = $.extend( {}, defaults, options );
	if ( this.settings.emptyIcon ) {
		this.settings.iconsPerPage--;
	}
	this.iconPicker = $( '<div/>', {
		class : 'icons-selector',
		style : 'position: relative',
		html  : this._getPickerTemplate()
	} );
	this.iconContainer = this.iconPicker.find( '.fip-icons-container' );
	this.searchIcon = this.iconPicker.find( '.selector-search i' );
	this.selectorPopup = this.iconPicker.find( '.selector-popup-wrap' );
	this.iconsSearched = [];
	this.isSearch = false;
	this.totalPage = 1;
	this.currentPage = 1;
	this.currentIcon = false;
	this.iconsCount = 0;
	this.open = false;

	// Set the default values for the search related variables
	this.searchValues = [];
	this.availableCategoriesSearch = [];

	// The trigger event for change
	this.triggerEvent = null;

	// Backups
	this.backupSource = [];
	this.backupSearch = [];

	// Set the default values of the category related variables
	this.isCategorized = false; // Automatically detects if the icon listing is categorized
	this.selectCategory = this.iconPicker.find( '.icon-category-select' ); // The category SELECT input field
	this.selectedCategory = false; // false means all categories are selected
	this.availableCategories = []; // Available categories, it is a two dimensional array which holds categorized icons
	this.unCategorizedKey = null; // Key of the uncategorized category

	// Initialize plugin
	this.init();
}

FontIconPicker.prototype = {

	/**
	 * Init
	 */
	init: function() {

		// Add the theme CSS to the iconPicker
		this.iconPicker.addClass( this.settings.theme );

		// To properly calculate iconPicker height and width
		// We will first append it to body (with left: -9999px so that it is not visible)
		this.iconPicker.css( {
			left: -9999
		} ).appendTo( 'body' );
		const iconPickerHeight = this.iconPicker.outerHeight(),
			iconPickerWidth = this.iconPicker.outerWidth();

		// Now reset the iconPicker CSS
		this.iconPicker.css( {
			left: ''
		} );

		// Add the icon picker after the select
		this.element.before( this.iconPicker );


		// Hide source element
		// Instead of doing a display:none, we would rather
		// make the element invisible
		// and adjust the margin
		this.element.css( {
			visibility: 'hidden',
			top: 0,
			position: 'relative',
			zIndex: '-1',
			left: '-' + iconPickerWidth + 'px',
			display: 'inline-block',
			height: iconPickerHeight + 'px',
			width: iconPickerWidth + 'px',

			// Reset all margin, border and padding
			padding: '0',
			margin: '0 -' + iconPickerWidth + 'px 0 0', // Left margin adjustment to account for dangling space
			border: '0 none',
			verticalAlign: 'top',
			float: 'none' // Fixes positioning with floated elements
		} );

		// Set the trigger event
		if ( ! this.element.is( 'select' ) ) {

			// Drop IE9 support and use the standard input event
			this.triggerEvent = 'input';
		}

		// If current element is SELECT populate settings.source
		if ( ! this.settings.source && this.element.is( 'select' ) ) {

			// Populate data from select
			this._populateSourceFromSelect();

		// Normalize the given source
		} else {
			this._initSourceIndex();
		}

		// load the categories
		this._loadCategories();

		// Load icons
		this._loadIcons();

		// Initialize dropdown button
		this._initDropDown();

		// Category changer
		this._initCategoryChanger();

		// Pagination
		this._initPagination();

		// Icon Search
		this._initIconSearch();

		// Icon Select
		this._initIconSelect();

		/**
		 * On click out
		 * Add the functionality #9
		 * {@link https://github.com/micc83/fontIconPicker/issues/9}
		 */
		this._initAutoClose();

		// Window resize fix
		this._initFixOnResize();
	},

	/**
	 * Set icons after the fip has been initialized
	 */
	setIcons( newIcons, iconSearch ) {
		this.settings.source = newIcons;
		this.settings.searchSource = iconSearch;
		this._initSourceIndex();
		this._loadCategories();
		this._resetSearch();
		this._loadIcons();
	},

	/**
	 * Set currently selected icon programmatically
	 *
	 * @param {string} theIcon current icon value
	 */
	setIcon( theIcon = '' ) {
		this._setSelectedIcon( theIcon );
	},

	/**
	 * Destroy picker and all events
	 */
	destroy() {
		this.iconPicker.off().remove();
		this.element.css( {
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
	},

	/**
	 * Initialize Fix on window resize with debouncing
	 * This helps reduce function call unnecessary times.
	 */
	_initFixOnResize() {

		/**
		 * Implementation of debounce function
		 *
		 * {@link https://medium.com/a-developers-perspective/throttling-and-debouncing-in-javascript-b01cad5c8edf}
		 * @param {Function} func callback function
		 * @param {int} delay delay in milliseconds
		 */
		const debounce = ( func, delay ) => {
			let inDebounce;
			return function() {
				const context = this;
				const args = arguments;
				clearTimeout( inDebounce );
				inDebounce = setTimeout( () => func.apply( context, args ), delay );
			};
		};

		$( window ).on( 'resize.fonticonpicker', debounce( () => {
			this._fixOnResize();
		}, this.settings.windowDebounceDelay ) );
	},

	/**
	 * Initiate autoClosing
	 *
	 * Checks for settings, and if set to yes, then autocloses the dropdown
	 */
	_initAutoClose() {
		if ( this.settings.autoClose ) {
			$( 'html' ).on( 'click', ( event ) => {

				// Check if event is coming from selector popup or icon picker
				const target = event.target;
				if ( this.selectorPopup.has( target ).length ||
					this.selectorPopup.is( target ) ||
					this.iconPicker.has( target ).length ||
					this.iconPicker.is( target ) ) {

					// Return
					return;
				}

				// Close it
				if ( this.open ) {
					this._toggleIconSelector();
				}
			} );
		}
	},

	/**
	 * Select Icon
	 */
	_initIconSelect() {
		this.selectorPopup.on( 'click', '.fip-box', e => {
			const fipBox = $( e.currentTarget );
			this._setSelectedIcon( fipBox.attr( 'data-fip-value' ), fipBox.attr( 'title' ) );
			this._toggleIconSelector();
		} );
	},

	/**
	 * Initiate realtime icon search
	 */
	_initIconSearch() {
		this.selectorPopup.on( 'input', '.icons-search-input', e => {

			// Get the search string
			const searchString = $( e.currentTarget ).val();

			// If the string is not empty
			if ( '' === searchString ) {
				this._resetSearch();
				return;
			}

			// Set icon search to X to reset search
			this.searchIcon.removeClass( 'fip-icon-search' );
			this.searchIcon.addClass( 'fip-icon-cancel' );

			// Set this as a search
			this.isSearch = true;

			// Reset current page
			this.currentPage = 1;

			// Actual search
			// This has been modified to search the searchValues instead
			// Then return the value from the source if match is found
			this.iconsSearched = [];
			$.grep( this.searchValues, ( n, i ) => {
				if ( 0 <= n.toLowerCase().search( searchString.toLowerCase() ) ) {
					this.iconsSearched[this.iconsSearched.length] = this.settings.source[i];
					return true;
				}
			} );

			// Render icon list
			this._renderIconContainer();
		} );

		/**
		* Quit search
		*/
		// Quit search happens only if clicked on the cancel button
		this.selectorPopup.on( 'click', '.selector-search .fip-icon-cancel', () => {
			this.selectorPopup.find( '.icons-search-input' ).focus();
			this._resetSearch();
		} );
	},

	/**
	 * Initiate Pagination
	 */
	_initPagination() {

		/**
		* Next page
		*/
		this.selectorPopup.on( 'click', '.selector-arrow-right', e => {
			if ( this.currentPage < this.totalPage ) {
				this.currentPage = this.currentPage + 1;
				this._renderIconContainer();
			}
		} );

		/**
		* Prev page
		*/
		this.selectorPopup.on( 'click', '.selector-arrow-left', e => {
			if ( 1 < this.currentPage ) {
				this.currentPage = this.currentPage - 1;
				this._renderIconContainer();
			}
		} );
	},

	/**
	 * Initialize category changer dropdown
	 */
	_initCategoryChanger() {

		// Since the popup can be appended anywhere
		// We will add the event listener to the popup
		// And will stop the eventPropagation on click
		// @since v2.1.0
		this.selectorPopup.on( 'change keyup', '.icon-category-select', e => {

			// Don't do anything if not categorized
			if ( false === this.isCategorized ) {
				return false;
			}
			const targetSelect = $( e.currentTarget ),
				currentCategory = targetSelect.val();

			// Check if all categories are selected
			if ( 'all' === targetSelect.val() ) {

				// Restore from the backups
				// @note These backups must be rebuild on source change, otherwise it will lead to error
				this.settings.source = this.backupSource;
				this.searchValues = this.backupSearch;

			// No? So there is a specified category
			} else {
				const key = parseInt( currentCategory, 10 );
				if ( this.availableCategories[key] ) {
					this.settings.source = this.availableCategories[key];
					this.searchValues = this.availableCategoriesSearch[key];
				}
			}
			this._resetSearch();
			this._loadIcons();
		} );
	},

	/**
	 * Initialize Dropdown button
	 */
	_initDropDown() {
		this.iconPicker.find( '.selector-button' ).on( 'click', event => {

			// Open/Close the icon picker
			this._toggleIconSelector();

		} );
	},

	/**
	 * Get icon Picker Template String
	 */
	_getPickerTemplate() {
		const pickerTemplate = `
<div class="selector">
	<span class="selected-icon">
		<i class="fip-icon-block"></i>
	</span>
	<span class="selector-button">
		<i class="fip-icon-down-dir"></i>
	</span>
</div>
<div class="selector-popup-wrap">
	<div class="selector-popup" style="display: none;"> ${ ( this.settings.hasSearch ) ?
		`<div class="selector-search">
			<input type="text" name="" value="" placeholder="${ this.settings.searchPlaceholder }" class="icons-search-input"/>
			<i class="fip-icon-search"></i>
		</div>` : '' }
		<div class="selector-category">
			<select name="" class="icon-category-select" style="display: none"></select>
		</div>
		<div class="fip-icons-container"></div>
		<div class="selector-footer" style="display:none;">
			<span class="selector-pages">1/2</span>
			<span class="selector-arrows">
				<span class="selector-arrow-left" style="display:none;">
					<i class="fip-icon-left-dir"></i>
				</span>
				<span class="selector-arrow-right">
					<i class="fip-icon-right-dir"></i>
				</span>
			</span>
		</div>
	</div>
</div>`;
		return pickerTemplate;
	},


	/**
	 * Init the source & search index from the current settings
	 * @return {void}
	 */
	_initSourceIndex: function() {

		// First check for any sorts of errors
		if ( 'object' !== typeof this.settings.source ) {
			return;
		}

		// We are going to check if the passed source is an array or an object
		// If it is an array, then don't do anything
		// otherwise it has to be an object and therefore is it a categorized icon set
		if ( $.isArray( this.settings.source ) ) {

			// This is not categorized since it is 1D array
			this.isCategorized = false;
			this.selectCategory.html( '' ).hide();

			// We are going to convert the source items to string
			// This is necessary because passed source might not be "strings" for attribute related icons
			this.settings.source = $.map( this.settings.source, ( e, i ) => {
				if ( 'function' == typeof e.toString ) {
					return e.toString();
				} else {
					return e;
				}
			} );

			// Now update the search
			// First check if the search is given by user
			if ( $.isArray( this.settings.searchSource ) ) {

				// Convert everything inside the searchSource to string
				this.searchValues = $.map( this.settings.searchSource, ( e, i ) => {
					if ( 'function' == typeof e.toString ) {
						return e.toString();
					} else {
						return e;
					}
				} ); // Clone the searchSource
			// Not given so use the source instead
			} else {
				this.searchValues = this.settings.source.slice( 0 ); // Clone the source
			}

		// Categorized icon set
		} else {
			const originalSource = $.extend( true, {}, this.settings.source );

			// Reset the source
			this.settings.source = [];

			// Reset other variables
			this.searchValues = [];
			this.availableCategoriesSearch = [];
			this.selectedCategory = false;
			this.availableCategories = [];
			this.unCategorizedKey = null;

			// Set the categorized to true and reset the HTML
			this.isCategorized = true;
			this.selectCategory.html( '' );

			// Now loop through the source and add to the list
			for ( const categoryLabel in originalSource ) {

				// Get the key of the new category array
				const thisCategoryKey = this.availableCategories.length,

					// Create the new option for the selectCategory SELECT field
					categoryOption = $( '<option />' );

				// Set the value to this categorykey
				categoryOption.attr( 'value', thisCategoryKey );

				// Set the label
				categoryOption.html( categoryLabel );

				// Append to the DOM
				this.selectCategory.append( categoryOption );

				// Init the availableCategories array
				this.availableCategories[thisCategoryKey] = [];
				this.availableCategoriesSearch[thisCategoryKey] = [];

				// Now loop through it's icons and add to the list
				for ( const newIconKey in originalSource[categoryLabel] ) {

					// Get the new icon value
					const newIconValue = originalSource[categoryLabel][newIconKey];

					// Get the label either from the searchSource if set, otherwise from the source itself
					const newIconLabel = ( this.settings.searchSource && this.settings.searchSource[categoryLabel] && this.settings.searchSource[categoryLabel][newIconKey] ) ?
						this.settings.searchSource[categoryLabel][newIconKey] : newIconValue;

					// Try to convert to the source value string
					// This is to avoid attribute related icon sets
					// Where hexadecimal or decimal numbers might be passed
					if ( 'function' == typeof newIconValue.toString ) {
						newIconValue = newIconValue.toString();
					}

					// Check if the option element has value and this value does not equal to the empty value
					if ( newIconValue && newIconValue !== this.settings.emptyIconValue ) {

						// Push to the source, because at first all icons are selected
						this.settings.source.push( newIconValue );

						// Push to the availableCategories child array
						this.availableCategories[thisCategoryKey].push( newIconValue );

						// Push to the search values
						this.searchValues.push( newIconLabel );
						this.availableCategoriesSearch[thisCategoryKey].push( newIconLabel );
					}
				}
			}
		}

		// Clone and backup the original source and search
		this.backupSource = this.settings.source.slice( 0 );
		this.backupSearch = this.searchValues.slice( 0 );
	},

	/**
	 * Populate source from select element
	 * Check if select has optgroup, if so, then we are dealing with categorized
	 * data. Otherwise, plain data.
	 */
	_populateSourceFromSelect() {

		// Reset the source and searchSource
		// These will be populated according to the available options
		this.settings.source = [];
		this.settings.searchSource = [];

		// Check if optgroup is present within the select
		// If it is present then the source has to be grouped
		if ( this.element.find( 'optgroup' ).length ) {

			// Set the categorized to true
			this.isCategorized = true;
			this.element.find( 'optgroup' ).each( ( i, el ) => {

				// Get the key of the new category array
				const thisCategoryKey = this.availableCategories.length,

					// Create the new option for the selectCategory SELECT field
					categoryOption = $( '<option />' );

				// Set the value to this categorykey
				categoryOption.attr( 'value', thisCategoryKey );

				// Set the label
				categoryOption.html( $( el ).attr( 'label' ) );

				// Append to the DOM
				this.selectCategory.append( categoryOption );

				// Init the availableCategories array
				this.availableCategories[thisCategoryKey] = [];
				this.availableCategoriesSearch[thisCategoryKey] = [];

				// Now loop through it's option elements and add the icons
				$( el ).find( 'option' ).each( ( i, cel ) => {
					const newIconValue = $( cel ).val(),
						newIconLabel = $( cel ).html();

					// Check if the option element has value and this value does not equal to the empty value
					if ( newIconValue && newIconValue !== this.settings.emptyIconValue ) {

						// Push to the source, because at first all icons are selected
						this.settings.source.push( newIconValue );

						// Push to the availableCategories child array
						this.availableCategories[thisCategoryKey].push( newIconValue );

						// Push to the search values
						this.searchValues.push( newIconLabel );
						this.availableCategoriesSearch[thisCategoryKey].push( newIconLabel );
					}
				} );
			} );

			// Additionally check for any first label option child
			if ( this.element.find( '> option' ).length ) {
				this.element.find( '> option' ).each( ( i, el ) => {
					const newIconValue = $( el ).val(),
						newIconLabel = $( el ).html();

					// Don't do anything if the new icon value is empty
					if ( ! newIconValue || '' === newIconValue || newIconValue == this.settings.emptyIconValue ) {
						return true;
					}

					// Set the uncategorized key if not set already
					if ( null === this.unCategorizedKey ) {
						this.unCategorizedKey = this.availableCategories.length;
						this.availableCategories[this.unCategorizedKey] = [];
						this.availableCategoriesSearch[this.unCategorizedKey] = [];

						// Create an option and append to the category selector
						$( '<option />' ).attr( 'value', this.unCategorizedKey ).html( this.settings.unCategorizedText ).appendTo( this.selectCategory );
					}

					// Push the icon to the category
					this.settings.source.push( newIconValue );
					this.availableCategories[this.unCategorizedKey].push( newIconValue );

					// Push the icon to the search
					this.searchValues.push( newIconLabel );
					this.availableCategoriesSearch[this.unCategorizedKey].push( newIconLabel );
				} );
			}

		// Not categorized
		} else {
			this.element.find( 'option' ).each( ( i, el ) => {
				const newIconValue = $( el ).val(),
					newIconLabel = $( el ).html();
				if ( newIconValue ) {
					this.settings.source.push( newIconValue );
					this.searchValues.push( newIconLabel );
				}
			} );
		}

		// Clone and backup the original source and search
		this.backupSource = this.settings.source.slice( 0 );
		this.backupSearch = this.searchValues.slice( 0 );
	},

	/**
	 * Load Categories
	 * @return {void}
	 */
	_loadCategories: function() {

		// Dont do anything if it is not categorized
		if ( false === this.isCategorized ) {
			return;
		}

		// Now append all to the category selector
		$( '<option value="all">' + this.settings.allCategoryText + '</option>' ).prependTo( this.selectCategory );

		// Show it and set default value to all categories
		this.selectCategory.show().val( 'all' ).trigger( 'change' );
	},

	/**
	 * Load icons
	 */
	_loadIcons: function() {

		// Set the content of the popup as loading
		this.iconContainer.html( '<i class="fip-icon-spin3 animate-spin loading"></i>' );

		// If source is set
		if ( $.isArray( this.settings.source ) ) {

			// Render icons
			this._renderIconContainer();
		}
	},

	/**
	 * Generate icons
	 *
	 * Supports hookable third-party renderer function.
	 */
	_iconGenerator: function( icon ) {
		if ( 'function' === typeof this.settings.iconGenerator ) {
			return this.settings.iconGenerator( icon );
		}
		return '<i ' + ( this.settings.useAttribute ? ( this.settings.attributeName + '="' + ( this.settings.convertToHex ? '&#x' + parseInt( icon, 10 ).toString( 16 ) + ';' : icon ) + '"' ) : 'class="' + icon + '"' ) + '></i>';
	},

	/**
	 * Render icons inside the popup
	 */
	_renderIconContainer: function() {

		let offset,
			iconsPaged = [],
			footerTotalIcons;

		// Set a temporary array for icons
		if ( this.isSearch ) {
			iconsPaged = this.iconsSearched;
		} else {
			iconsPaged = this.settings.source;
		}

		// Count elements
		this.iconsCount = iconsPaged.length;

		// Calculate total page number
		this.totalPage = Math.ceil( this.iconsCount / this.settings.iconsPerPage );

		// Hide footer if no pagination is needed
		if ( 1 < this.totalPage ) {
			this.selectorPopup.find( '.selector-footer' ).show();

			// Reset the pager buttons
			// Fix #8 {@link https://github.com/micc83/fontIconPicker/issues/8}
			// It is better to set/hide the pager button here
			// instead of all other functions that calls back _renderIconContainer
			if ( this.currentPage < this.totalPage ) { // current page is less than total, so show the arrow right
				this.selectorPopup.find( '.selector-arrow-right' ).show();
			} else { // else hide it
				this.selectorPopup.find( '.selector-arrow-right' ).hide();
			}
			if ( 1 < this.currentPage ) { // current page is greater than one, so show the arrow left
				this.selectorPopup.find( '.selector-arrow-left' ).show();
			} else { // else hide it
				this.selectorPopup.find( '.selector-arrow-left' ).hide();
			}
		} else {
			this.selectorPopup.find( '.selector-footer' ).hide();
		}

		// Set the text for page number index and total icons
		this.selectorPopup.find( '.selector-pages' ).html( this.currentPage + '/' + this.totalPage + ' <em>(' + this.iconsCount + ')</em>' );

		// Set the offset for slice
		offset = ( this.currentPage - 1 ) * this.settings.iconsPerPage;

		// Should empty icon be shown?
		if ( this.settings.emptyIcon ) {

			// Reset icon container HTML and prepend empty icon
			this.iconContainer.html( '<span class="fip-box" data-fip-value="fip-icon-block"><i class="fip-icon-block"></i></span>' );

		// If not show an error when no icons are found
		} else if ( 1 > iconsPaged.length ) {
			this.iconContainer.html( '<span class="icons-picker-error" data-fip-value="fip-icon-block"><i class="fip-icon-block"></i></span>' );
			return;

		// else empty the container
		} else {
			this.iconContainer.html( '' );
		}

		// Set an array of current page icons
		iconsPaged = iconsPaged.slice( offset, offset + this.settings.iconsPerPage );

		// List icons
		for ( let i = 0, icon; icon = iconsPaged[i++]; ) { // eslint-disable-line

			// Set the icon title
			let fipBoxTitle = icon;
			$.grep( this.settings.source, $.proxy( function( e, i ) {
				if ( e === icon ) {
					fipBoxTitle =  this.searchValues[i];
					return true;
				}
				return false;
			}, this ) );

			// Set the icon box
			$( '<span/>', {
				html:      this._iconGenerator( icon ),
				attr: {
					'data-fip-value': icon
				},
				class:   'fip-box',
				title: fipBoxTitle
			} ).appendTo( this.iconContainer );
		}

		// If no empty icon is allowed and no current value is set or current value is not inside the icon set
		if ( ! this.settings.emptyIcon && ( ! this.element.val() || -1 === $.inArray( this.element.val(), this.settings.source ) ) ) {

			// Get the first icon
			this._setSelectedIcon( iconsPaged[0] );

		} else if ( -1 === $.inArray( this.element.val(), this.settings.source ) ) {

			// Issue #7
			// Need to pass empty string
			// Set empty
			// Otherwise DOM will be set to null value
			// which would break the initial select value
			this._setSelectedIcon( '' );

		} else {

			// Fix issue #7
			// The trick is to check the element value
			// Internally fip-icon-block must be used for empty values
			// So if element.val == emptyIconValue then pass fip-icon-block
			let passDefaultIcon = this.element.val();
			if ( passDefaultIcon === this.settings.emptyIconValue ) {
				passDefaultIcon = 'fip-icon-block';
			}

			// Set the default selected icon even if not set
			this._setSelectedIcon( passDefaultIcon );
		}

	},

	/**
	 * Set Highlighted icon
	 */
	_setHighlightedIcon: function() {
		this.iconContainer.find( '.current-icon' ).removeClass( 'current-icon' );
		if ( this.currentIcon ) {
			this.iconContainer.find( '[data-fip-value="' + this.currentIcon + '"]' ).addClass( 'current-icon' );
		}
	},

	/**
	 * Set selected icon
	 *
	 * @param {string} theIcon
	 */
	_setSelectedIcon: function( theIcon ) {
		if ( 'fip-icon-block' === theIcon ) {
			theIcon = '';
		}

		const selectedIcon = this.iconPicker.find( '.selected-icon' );

		// if the icon is empty, then reset to empty
		if ( '' === theIcon ) {
			selectedIcon.html( '<i class="fip-icon-block"></i>' );
		} else {

			// Pass it to the render function
			selectedIcon.html( this._iconGenerator( theIcon ) );
		}

		// Check if actually changing the DOM element
		const currentValue = this.element.val();

		// Set the value of the element
		this.element.val( ( '' === theIcon ? this.settings.emptyIconValue : theIcon ) );

		// trigger event if change has actually occured
		if ( currentValue !== theIcon ) {
			this.element.trigger( 'change' );
			if ( null !== this.triggerEvent ) {
				this.element.trigger( this.triggerEvent );
			}
		}

		this.currentIcon = theIcon;
		this._setHighlightedIcon();
	},

	/**
	 * Recalculate the position of the Popup
	 */
	_repositionIconSelector: function() {

		// Calculate the position + width
		const offset = this.iconPicker.offset(),
			offsetTop = offset.top + this.iconPicker.outerHeight( true ),
			offsetLeft = offset.left;

		this.selectorPopup.css( {
			left: offsetLeft,
			top: offsetTop
		} );
	},

	/**
	 * Fix window overflow of popup dropdown if needed
	 *
	 * This can happen if appending to self or someplace else
	 */
	_fixWindowOverflow() {

		// Adjust the offsetLeft
		// Resolves issue #10
		// @link https://github.com/micc83/fontIconPicker/issues/10
		const visibilityStatus = this.selectorPopup.find( '.selector-popup' ).is( ':visible' );
		if ( ! visibilityStatus ) {
			this.selectorPopup.find( '.selector-popup' ).show();
		}
		const popupWidth = this.selectorPopup.width(),
			windowWidth = $( window ).width(),
			popupOffsetLeft = this.selectorPopup.offset().left,
			containerOffset = ( 'self' == this.settings.appendTo ? this.selectorPopup.parent().offset() : $( this.settings.appendTo ).offset() );
		if ( ! visibilityStatus ) {
			this.selectorPopup.find( '.selector-popup' ).hide();
		}
		if ( popupOffsetLeft + popupWidth > windowWidth - 20 /* 20px adjustment for better appearance */ ) {
			this.selectorPopup.css( {
				left: windowWidth - 20 - popupWidth - containerOffset.left
			} );
		}
	},

	/**
	 * Fix on Window Resize
	 */
	_fixOnResize() {

		// If the appendTo is not self, then we need to reposition the dropdown
		if ( 'self' !== this.settings.appendTo ) {
			this._repositionIconSelector();
		}

		// In any-case, we need to fix for window overflow
		this._fixWindowOverflow();
	},

	/**
	 * Open/close popup (toggle)
	 */
	_toggleIconSelector: function() {
		this.open = ( ! this.open ) ? 1 : 0;

		// Append the popup if needed
		if ( this.open ) {

			// Check the origin
			if ( 'self' !== this.settings.appendTo ) {

				// Append to the selector and set the CSS + theme
				this.selectorPopup.appendTo( this.settings.appendTo ).css( {
					zIndex: 1000 // Let's decrease the zIndex to something reasonable
				} ).addClass( 'icons-selector ' + this.settings.theme );

				// call resize()
				this._repositionIconSelector();
			}

			// Fix positioning if needed
			this._fixWindowOverflow();
		}

		this.selectorPopup.find( '.selector-popup' ).slideToggle( 300, $.proxy( function() {
			this.iconPicker.find( '.selector-button i' ).toggleClass( 'fip-icon-down-dir' );
			this.iconPicker.find( '.selector-button i' ).toggleClass( 'fip-icon-up-dir' );
			if ( this.open ) {
				this.selectorPopup.find( '.icons-search-input' ).trigger( 'focus' ).trigger( 'select' );
			} else {

				// append and revert to the original position and reset theme
				this.selectorPopup.appendTo( this.iconPicker ).css( {
					left: '',
					top: '',
					zIndex: ''
				} ).removeClass( 'icons-selector ' + this.settings.theme );
			}
		}, this ) );
	},

	/**
	 * Reset search
	 */
	_resetSearch: function() {

		// Empty input
		this.selectorPopup.find( '.icons-search-input' ).val( '' );

		// Reset search icon class
		this.searchIcon.removeClass( 'fip-icon-cancel' );
		this.searchIcon.addClass( 'fip-icon-search' );

		// Go back to page 1
		this.currentPage = 1;
		this.isSearch = false;

		// Rerender icons
		this._renderIconContainer();
	}
};

// ES6 Export it as module
export { FontIconPicker };
