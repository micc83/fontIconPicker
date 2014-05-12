jQuery fontIconPicker
==============

jQuery fontIconPicker is a small (1.58kb gzipped) jQuery plugin which allows you to include a simple icon picker with search and pagination inside your administration forms. The list of icons can be loaded manually using a SELECT field, loading an array of icons or directly from a Fontello config.json file. Go to the [official plugin page](http://codeb.it/fonticonpicker) for some examples.

## How it works
Just include a copy of jQuery, the fontIconPickers script, the fontIconPickers theme and your Font Icons... Now you can trigger it on a SELECT or TEXT input...

    <!-- jQuery -->
    <script src="jquery-1.7.1.min.js"></script>

    <!-- fontIconPicker -->
    <script src="jquery.fonticonpicker.min.js"></script>
    <link rel="stylesheet" href="css/jquery.fonticonpicker.min.css">
    <link rel="stylesheet" href="themes/grey-theme/jquery.fonticonpicker.grey.min.css">
    <link rel="stylesheet" href="themes/dark-grey-theme/jquery.fonticonpicker.darkgrey.min.css">

    <!-- Font Icons -->
    <link rel="stylesheet" href="fontello-7275ca86/css/fontello.css">
    <link rel="stylesheet" href="icomoon/icomoon.css">

Here's fontIconPicker options:

    var $picker = $('.picker').fontIconPicker({
        theme             : 'fip-grey',              // The CSS theme to use with this fontIconPicker. You can have multiple themes on multiple elements
        source            : false,                   // Icons source (array|false|object)
        emptyIcon         : true,                    // Empty icon should be shown?
        emptyIconValue    : '',                      // The value of the empty icon, change if you select has something else, say "none"
        iconsPerPage      : 20,                      // Number of icons per page
        hasSearch         : true,                    // Is search enabled?
        searchSource      : false,                   // Give a manual search values. If using attributes then for proper search feature we also need to pass icon names under the same order of source
        useAttribute      : false,                   // Whether to use attribute for printing icons
        attributeName     : 'data-icon',             // HTML Attribute name
        convertToHex      : true,                    // Whether or not to convert to hexadecimal for attribute value. If true then please pass decimal integer value to the source (or as value="" attribute of the select field)
        allCategoryText   : 'From all category',     // The text for the select all category option
        unCategorizedText : 'Uncategorized'          // The text for the select uncategorized option
    });

And it's only custom method .loadIcons() which lets you load icon sets on the fly.

    $picker.loadIcons(['icon-one', 'icon-two']);
    $picker.loadIcons(['icon-one', 'icon-two'], ['Icon one will be searched by this', 'Icon two will be searched by this']);

### Important notes for local demo

Only when loading demo locally: In firefox fontIconPicker icons won't be shown correctly because of CORS. For the same reason "Load icons from Fontello JSON config file" won't work on Chrome or IE 10. If you need to do some local testing you can disable strict_origin_policy at your risk.

## Browser Compatibility

jQuery iconPicker has been successfully tested on: Firefox (edge), Safari (edge), Chrome (edge), IE8+.

## Credits

jQuery fontIconPicker has been made by [me](http://codeb.it). You can contact me at micc83@gmail.com or [twitter](https://twitter.com/Micc1983) for any issue or feauture request.

I really have to thank miniMAC for the idea, Zeno Rocha for jQuery plugin boilerplate, Dave Gandy for the beautiful set of icons and Elliot Condon for the amazing Advanced Custom Field WordPress plugin.
