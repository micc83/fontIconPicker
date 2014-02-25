/**
 *  jQuery fontIconPicker - v1.0.0
 *
 *  An icon picker built on top of font icons and jQuery
 *
 *  http://codeb.it/fontIconPicker
 *
 *  Made by Alessandro Benoit
 *  Under MIT License
 * 
 */
;(function ($) {

    'use strict';

    // Create the defaults once
    var defaults = {
            source:         false,      // Icons source
            emptyIcon:      true,       // Empty icon should be shown?
            iconsPerPage:   20,         // Number of icons per page
            hasSearch:      true        // Is search enabled?
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        if (this.settings.emptyIcon) { this.settings.iconsPerPage--; }
        this.iconPicker = $('<div/>', {
            'class':    'icons-selector',
            style:      'position: relative',
            html:       '<div class="selector">' +
                            '<span class="selected-icon">' +
                                '<i class="fip-icon-block"></i>' +
                            '</span>' +
                            '<span class="selector-button">' +
                                '<i class="fip-icon-down-dir"></i>' +
                            '</span>' +
                         '</div>' +
                         '<div class="selector-popup" style="display: none;">' + ((this.settings.hasSearch) ?
                             '<div class="selector-search">' +
                                 '<input type="text" name="" value="" placeholder="Search icon" class="icons-search-input"/>' +
                                 '<i class="fip-icon-search"></i>' +
                             '</div>' : '') +
                             '<div class="fip-icons-container"></div>' +
                             '<div class="selector-footer" style="display:none;">' +
                                 '<span class="selector-pages">1/2</span>' +
                                 '<span class="selector-arrows">' +
                                     '<span class="selector-arrow-left" style="display:none;">' +
                                         '<i class="fip-icon-left-dir"></i>' +
                                     '</span>' +
                                     '<span class="selector-arrow-right">' +
                                         '<i class="fip-icon-right-dir"></i>' +
                                     '</span>' +
                                 '</span>' +
                             '</div>' +
                         '</div>'
        });
        this.iconContainer = this.iconPicker.find('.fip-icons-container');
        this.searchIcon = this.iconPicker.find('.selector-search i');
        this.iconsSearched = [];
        this.isSearch = false;
        this.totalPage = 1;
        this.currentPage = 1;
        this.currentIcon = false;
        this.iconsCount = 0;
        this.open = false;

        // Initialize plugin
        this.init();

    }

    Plugin.prototype = {
        /**
         * Init
         */
        init: function () {
            // Hide source element
            this.element.hide();

            // Add the icon picker after the select
            this.element.before(this.iconPicker);

            // If current element is SELECT populate settings.source
            if (!this.settings.source && this.element.is('select')) {
                this.settings.source = [];
                this.element.find('option').each($.proxy(function (i, el) {
                    if ($(el).val()) {
                        this.settings.source.push($(el).val());
                    }
                }, this));
            }

            // Load icons
            this.loadIcons();

            /**
             * On down arrow click
             */
            this.iconPicker.find('.selector-button').click($.proxy(function () {

                // Open/Close the icon picker
                this.toggleIconSelector();

            }, this));

            /**
             * Next page
             */
            this.iconPicker.find('.selector-arrow-right').click($.proxy(function (e) {

                if (this.currentPage < this.totalPage) {
                    this.iconPicker.find('.selector-arrow-left').show();
                    this.currentPage = this.currentPage + 1;
                    this.renderIconContainer();
                }

                if (this.currentPage === this.totalPage) {
                    $(e.currentTarget).hide();
                }

            }, this));

            /**
             * Prev page
             */
            this.iconPicker.find('.selector-arrow-left').click($.proxy(function (e) {

                if (this.currentPage > 1) {
                    this.iconPicker.find('.selector-arrow-right').show();
                    this.currentPage = this.currentPage - 1;
                    this.renderIconContainer();
                }

                if (this.currentPage === 1) {
                    $(e.currentTarget).hide();
                }

            }, this));

            /**
             * Realtime Icon Search
             */
            this.iconPicker.find('.icons-search-input').keyup($.proxy(function (e) {

                // Get the search string
                var searchString = $(e.currentTarget).val();

                // If the string is not empty
                if (searchString === '') {
                    this.resetSearch();
                    return;
                }

                // Set icon search to X to reset search
                this.searchIcon.removeClass('fip-icon-search');
                this.searchIcon.addClass('fip-icon-cancel');

                // Set this as a search
                this.isSearch = true;

                // Reset current page
                this.currentPage = 1;

                // Actual search
                this.iconsSearched = $.grep(this.settings.source, function (n) {
                    if (n.search(searchString) >= 0) {
                        return n;
                    }
                });

                // Render icon list
                this.renderIconContainer();
            }, this));

            /**
             * Quit search
             */
            this.iconPicker.find('.selector-search').on('click', '.fip-icon-cancel', $.proxy(function () {
                this.iconPicker.find('.icons-search-input').focus();
                this.resetSearch();
            }, this));

            /**
             * On icon selected
             */
            this.iconContainer.on('click', '.fip-box', $.proxy(function (e) {
                this.setSelectedIcon($(e.currentTarget).find('i').attr('class'));
                this.toggleIconSelector();
            }, this));

            /**
             * Stop click propagation on iconpicker
             */
            this.iconPicker.click(function (event) {
                event.stopPropagation();
                return false;
            });

            /**
             * On click out
             */
            $('html').click($.proxy(function () {
                if (this.open) {
                    this.toggleIconSelector();
                }
            }, this));

        },

        /**
         * Load icons
         */
        loadIcons: function () {

            // Set the content of the popup as loading
            this.iconContainer.html('<i class="fip-icon-spin3 animate-spin loading"></i>');

            // If source is set
            if (this.settings.source instanceof Array) {

                // Render icons
                this.renderIconContainer();

            }

        },

        /**
         * Render icons inside the popup
         */
        renderIconContainer: function () {

            var offset, iconsPaged = [];

            // Set a temporary array for icons
            if (this.isSearch) {
                iconsPaged = this.iconsSearched;
            } else {
                iconsPaged = this.settings.source;
            }

            // Count elements
            this.iconsCount = iconsPaged.length;

            // Calculate total page number
            this.totalPage = Math.ceil(this.iconsCount / this.settings.iconsPerPage);

            // Hide footer if no pagination is needed
            if (this.totalPage > 1) {
                this.iconPicker.find('.selector-footer').show();
            } else {
                this.iconPicker.find('.selector-footer').hide();
            }

            // Set the text for page number index
            this.iconPicker.find('.selector-pages').text(this.currentPage + '/' + this.totalPage);

            // Set the offset for slice
            offset = (this.currentPage - 1) * this.settings.iconsPerPage;

            // Should empty icon be shown?
            if (this.settings.emptyIcon) {
                // Reset icon container HTML and prepend empty icon
                this.iconContainer.html('<span class="fip-box"><i class="fip-icon-block"></i></span>');

            // If not show an error when no icons are found
            } else if (iconsPaged.length < 1) {
                this.iconContainer.html('<span class="icons-picker-error"><i class="fip-icon-block"></i></span>');
                return;

            // else empty the container
            } else {
                this.iconContainer.html('');
            }

            // Set an array of current page icons
            iconsPaged = iconsPaged.slice(offset, offset + this.settings.iconsPerPage);

            // List icons
            for (var i = 0, item; item = iconsPaged[i++];) {
                $('<span/>', {
                    html:      '<i class="' + item + '"></i>',
                    'class':   'fip-box'
                }).appendTo(this.iconContainer);
            }

            // If no empty icon is allowed and no current value is set or current value is not inside the icon set
            if (!this.settings.emptyIcon && (!this.element.val() || $.inArray(this.element.val(), this.settings.source) === -1)) {

                // Get the first icon
                this.setSelectedIcon(iconsPaged[0]);

            } else if ($.inArray(this.element.val(), this.settings.source) === -1) {

                // Set empty
                this.setSelectedIcon();

            } else {
                // Set the default selected icon even if not set
                this.setSelectedIcon(this.element.val());
            }

        },

        /**
         * Set Highlighted icon
         */
        setHighlightedIcon: function () {
            this.iconContainer.find('.current-icon').removeClass('current-icon');
            if (this.currentIcon) {
                this.iconContainer.find('.' + this.currentIcon).parent('span').addClass('current-icon');
            }
        },

        /**
         * Set selected icon
         *
         * @param {string} theIcon
         */
        setSelectedIcon: function (theIcon) {
            if (theIcon === 'fip-icon-block') {
                theIcon = '';
            }
            this.iconPicker.find('.selected-icon').html('<i class="' + (theIcon || 'fip-icon-block') + '"></i>');
            // Set the value of the element and trigger change event
            this.element.val(theIcon).triggerHandler('change');
            this.currentIcon = theIcon;
            this.setHighlightedIcon();
        },

        /**
         * Open/close popup (toggle)
         */
        toggleIconSelector: function () {
            this.open = (!this.open) ? 1 : 0;
            this.iconPicker.find('.selector-popup').slideToggle(300);
            this.iconPicker.find('.selector-button i').toggleClass('fip-icon-down-dir');
            this.iconPicker.find('.selector-button i').toggleClass('fip-icon-up-dir');
            if (this.open) {
                this.iconPicker.find('.icons-search-input').focus().select();
            }
        },

        /**
         * Reset search
         */
        resetSearch: function () {

            // Empty input
            this.iconPicker.find('.icons-search-input').val('');

            // Reset search icon class
            this.searchIcon.removeClass('fip-icon-cancel');
            this.searchIcon.addClass('fip-icon-search');

            // Go back to page 1 and remove back arrow
            this.iconPicker.find('.selector-arrow-left').hide();
            this.currentPage = 1;
            this.isSearch = false;

            // Rerender icons
            this.renderIconContainer();

            // Restore pagination if needed
            if (this.totalPage > 1) {
                this.iconPicker.find('.selector-arrow-right').show();
            }
        }
    };

    // Lightweight plugin wrapper
    $.fn.fontIconPicker = function (options) {

        // Instantiate the plugin
        this.each(function () {
            if (!$.data(this, "fontIconPicker")) {
                $.data(this, "fontIconPicker", new Plugin(this, options));
            }
        });

        // setIcons method
        this.setIcons = $.proxy(function (newIcons) {
            this.each(function () {
                $.data(this, "fontIconPicker").settings.source = newIcons;
                $.data(this, "fontIconPicker").resetSearch();
                $.data(this, "fontIconPicker").loadIcons();
            });
        }, this);

        return this;
    };

})(jQuery);