/**
 * Demo JS for fontIconPicker
 */
jQuery(document).ready(function($) {
	/**
	 * These are DEMO related codes
	 */
	SyntaxHighlighter.all();
	$('body').scrollspy({
		target: '.navbar-main'
	});

	/**
	 * Init the fontPickers
	 */
	$('#first-example').fontIconPicker({
		useAttribute: true,
		theme: 'fip-darkgrey',
		attributeName: 'data-ipt-icomoon',
		emptyIconValue: 'none'
	});
});
