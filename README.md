jQuery fontIconPicker
==============

jQuery fontIconPicker is a small (`3.22KB` gzipped) jQuery plugin which allows you to include an elegant icon picker with categories, search and pagination inside your administration forms. The list of icons can be loaded manually using a `SELECT` field, an `Array` or `Object` of icons or directly from a Fontello `config.json` or IcoMoon `selection.json` file. Go to the [official plugin page](http://codeb.it/fonticonpicker) for examples and documentation.

![fontIconPickers](/demo/github-img.png)

## How it works
 Just include a copy of jQuery, the fontIconPickers script, the fontIconPickers theme and your Font Icons. Now you can trigger it on a `SELECT` or `INPUT[type="text"]` element.

### Include the JavaScript
 ```html
 <!-- jQuery -->
<script type="text/javascript" src="jquery-1.7.1.min.js"></script>

<!-- fontIconPicker JS -->
<script type="text/javascript" src="jquery.fonticonpicker.min.js"></script>
```

### Include the CSS
```html
<!-- fontIconPicker core CSS -->
<link rel="stylesheet" type="text/css" href="jquery.fonticonpicker.min.css" />

<!-- required default theme -->
<link rel="stylesheet" type="text/css" href="themes/grey-theme/jquery.fonticonpicker.grey.min.css" />

<!-- optional themes -->
<link rel="stylesheet" type="text/css" href="themes/dark-grey-theme/jquery.fonticonpicker.darkgrey.min.css" />
<link rel="stylesheet" type="text/css" href="themes/bootstrap-theme/jquery.fonticonpicker.bootstrap.min.css" />
<link rel="stylesheet" type="text/css" href="themes/inverted-theme/jquery.fonticonpicker.inverted.min.css" />
```

### Include Font Icons
```html
<!-- Font -->
<link rel="stylesheet" type="text/css" href="fontello-7275ca86/css/fontello.css" />
<link rel="stylesheet" type="text/css" href="icomoon/icomoon.css" />
```

### Initialize with jQuery
Finally call the fontIconPicker on a `SELECT` or `INPUT[type="text"]` element.

```html
<!-- SELECT element -->
<select id="myselect" name="myselect" class="myselect">
	<option value="">No icon</option>
	<option>icon-user</option>
	<option>icon-search</option>
	<option>icon-right-dir</option>
	<option>icon-star</option>
	<option>icon-cancel</option>
	<option>icon-help-circled</option>
	<option>icon-info-circled</option>
	<option>icon-eye</option>
	<option>icon-tag</option>
	<option>icon-bookmark</option>
	<option>icon-heart</option>
	<option>icon-thumbs-down-alt</option>
	<option>icon-upload-cloud</option>
	<option>icon-phone-squared</option>
	<option>icon-cog</option>
	<option>icon-wrench</option>
	<option>icon-volume-down</option>
	<option>icon-down-dir</option>
	<option>icon-up-dir</option>
	<option>icon-left-dir</option>
	<option>icon-thumbs-up-alt</option>
</select>
<!-- JavaScript -->
<script type="text/javascript">
	// Make sure to fire only when the DOM is ready
	jQuery(document).ready(function($) {
		$('#myselect').fontIconPicker(); // Load with default options
	});
</script>
```

```html
<!-- INPUT element -->
<input type="text" name="mytext" id="mytext" />
<script type="text/javascript">
	jQuery(document).ready(function($) {
		$('#mytext').fontIconPicker({
			source:    ['icon-heart', 'icon-search', 'icon-user', 'icon-tag', 'icon-help'],
			emptyIcon: false,
			hasSearch: false
		});
	});
</script>
```

## Plugin Options
Here's fontIconPicker options:
```js
var $picker = $('.picker').fontIconPicker({
	theme             : 'fip-grey',              // The CSS theme to use with this fontIconPicker. You can set different themes on multiple elements on the same page
	source            : false,                   // Icons source (array|false|object)
	emptyIcon         : true,                    // Empty icon should be shown?
	emptyIconValue    : '',                      // The value of the empty icon, change if you select has something else, say "none"
	iconsPerPage      : 20,                      // Number of icons per page
	hasSearch         : true,                    // Is search enabled?
	searchSource      : false,                   // Give a manual search values. If using attributes then for proper search feature we also need to pass icon names under the same order of source
	useAttribute      : false,                   // Whether to use attribute selector for printing icons
	attributeName     : 'data-icon',             // HTML Attribute name
	convertToHex      : true,                    // Whether or not to convert to hexadecimal for attribute value. If true then please pass decimal integer value to the source (or as value="" attribute of the select field)
	allCategoryText   : 'From all categories',   // The text for the select all category option
	unCategorizedText : 'Uncategorized'          // The text for the select uncategorized option
});
```

## Plugin APIs
fontIconPicker provides three public APIs to manipulating the icon picker.

### setIcons( `Array|Object` newIcons, `Array|Object` iconSearch )
 Use this method to dynamically change icons on the fly. `newIcons` and `iconSearch` (optional) have same datatypes as `source` and `searchSource` options.

```js
$picker.setIcons(['icon-one', 'icon-two']);
$picker.setIcons(['icon-one', 'icon-two'], ['Icon one will be searched by this', 'Icon two will be searched by this']);
```

### destroyPicker()
Use this to remove the icon picker and restore the original element.

```js
$picker.destroyPicker();
```

### refreshPicker( `Object|Boolean` newOptions )
Refresh the icon picker from DOM or passed options. Useful when DOM has been changed or reinitializing after calling the destroy method or changing the options values.

```js
$picker.refreshPicker({
	theme: 'fip-bootstrap',
	hasSearch: false
});
```

Options and APIs are discussed in details with live examples at the project page.

### Important notes for local demo

Only when loading demo locally: In firefox fontIconPicker icons won't be shown correctly because of CORS. For the same reason "Load icons from Fontello JSON config file" won't work on Chrome or IE 10. If you need to do some local testing you can disable strict_origin_policy at your risk.

## Browser Compatibility

jQuery iconPicker has been successfully tested on: Firefox (edge), Safari (edge), Chrome (edge), IE8+ and Opera (edge).

## Credits

jQuery fontIconPicker has been made by [me](http://codeb.it) & [swashata](https://github.com/swashata). You can contact me at micc83@gmail.com or [twitter](https://twitter.com/Micc1983) for any issue or feauture request.

I really have to thank miniMAC for the idea, Zeno Rocha for jQuery plugin boilerplate, Dave Gandy & KeyaMoon for the beautiful sets of icons and Elliot Condon for the amazing Advanced Custom Field WordPress plugin.
