/**
 * Default configuration options of fontIconPicker
 */
'use strict';
const options = {
	theme              : 'fip-grey',              // The CSS theme to use with this fontIconPicker. You can set different themes on multiple elements on the same page
	source             : false,                   // Icons source (array|false|object)
	emptyIcon          : true,                    // Empty icon should be shown?
	emptyIconValue     : '',                      // The value of the empty icon, change if you select has something else, say "none"
	autoClose          : true,                    // Whether or not to close the FIP automatically when clicked outside
	iconsPerPage       : 20,                      // Number of icons per page
	hasSearch          : true,                    // Is search enabled?
	searchSource       : false,                   // Give a manual search values. If using attributes then for proper search feature we also need to pass icon names under the same order of source
	appendTo           : 'self',                  // Where to append the selector popup. You can pass string selectors or jQuery objects
	useAttribute       : false,                   // Whether to use attribute selector for printing icons
	attributeName      : 'data-icon',             // HTML Attribute name
	convertToHex       : true,                    // Whether or not to convert to hexadecimal for attribute value. If true then please pass decimal integer value to the source (or as value="" attribute of the select field)
	allCategoryText    : 'From all categories',   // The text for the select all category option
	unCategorizedText  : 'Uncategorized',         // The text for the select uncategorized option
	iconGenerator      : null,                    // Icon Generator function. Passes, item, flipBoxTitle and index
	windowDebounceDelay: 150,                     // Debounce delay while fixing position on windowResize
	searchPlaceholder  : 'Search Icons'           // Placeholder for the search input
};

export default options;
