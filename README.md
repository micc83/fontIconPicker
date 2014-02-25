jQuery fontIconPicker
==============

jQuery fontIconPicker is a small (1.58kb gzipped) jQuery plugin which allows you to include a simple icon picker with search and pagination inside your administration forms. The list of icons can be loaded manually using a SELECT field, loading an array of icons or directly from a Fontello config.json file. Go to the [official plugin page](http://codeb.it/fonticonpicker) for some examples.

## How it works
Just include a copy of jQuery, the fontIconPickers script, the fontIconPickers theme and your Font Icons... Now you can trigger it on a SELECT or TEXT input...

    <!-- jQuery -->
    <script src="jquery-1.7.1.min.js"></script>
    
    <!-- fontIconPicker -->
    <script src="jquery.fonticonpicker.min.js"></script>
    <link rel="stylesheet" href="grey-theme/jquery.fonticonpicker.min.css">
    
    <!-- Font Icons -->
    <link rel="stylesheet" href="fontello-7275ca86/css/fontello.css">
    
Here's fontIconPicker options:

    var $picker = $('.picker').fontIconPicker({
        source:         false,      // Icons source (array|false)
        emptyIcon:      true,       // Empty icon should be shown?
        iconsPerPage:   20,         // Number of icons per page
        hasSearch:      true        // Is search enabled?
    });

And it's only custom method .loadIcons() which lets you load icon sets on the fly.

    $picker.loadIcons(['icon-one', 'icon-two']);
    
### Important notes for local demo

Only when loading demo locally: In firefox fontIconPicker icons won't be shown correctly because of CORS. For the same reason "Load icons from Fontello JSON config file" won't work on Chrome or IE 10. If you need to do some local testing you can disable strict_origin_policy at your risk. 

## Browser Compatibility

jQuery iconPicker has been successfully tested on: Firefox (edge), Safari (edge), Chrome (edge), IE8+.

## Credits

jQuery fontIconPicker has been made by me. You can contact me at micc83@gmail.com or twitter for any issue or feauture request.

I really have to thank miniMAC for the idea, Zeno Rocha for jQuery plugin boilerplate, Dave Gandy for the beautiful set of icons and Elliot Condon for the amazing Advanced Custom Field WordPress plugin.
