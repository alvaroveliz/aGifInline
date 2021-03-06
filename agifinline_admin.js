(function() {


    tinymce.create('tinymce.plugins.agifinline', {
        init: function(ed, url) {
            ed.addButton('agifinline', {
                title: 'Gif Inline',
                image: url + '/gif.png',
                onclick: function() {
                    jQuery('#agifinline-form').dialog('open');
                }
            });
        },
        createControl: function(n, cm) {
            return null;
        },
    });

    tinymce.PluginManager.add('agifinline', tinymce.plugins.agifinline);

    jQuery(function() {

        var form = jQuery('<div id="agifinline-form" title="Alvaro\'s Gif Inline ">\
                    <form>\
                        <input type="text" id="agifinline-search" name="search" placeholder="Search an image or insert the URL" /><br />\
                        <div id="agifinline-result">\
                            <div id="agifinline-placeholder">Search gifs using #tags or categories.<br />Powered by <a href="http://giphy.com/">Giphy.com</a></div>\
                        </div>\
                        <div id="agifinline-url">\
                            <p class="howto">Insert destination URL</p>\
                            <div>\
                                <label><input type="text" placeholder="http://..." name="agifinline-href" id="agifinline-href"></label>\
                            </div>\
                        </div>\
                        <div class="submitbox">\
                            <div id="wp-link-update">\
                                <input type="button" id="agifinline-submit" class="button button-disabled" value="Insert Gif" name="submit" />\
                            </div>\
                            <div id="wp-link-cancel">\
                                <a href="#" id="agifinline-cancel" class="submitdelete deletion">Cancel</a>\
                            </div>\
                        </div>\
                    </form>\
                    </div>');

        var table = form.find('table');
        var $xhr, $selected, $url;
        form.appendTo('body').hide();

        jQuery(form).dialog({
            dialogClass: 'wp-dialog',
            autoOpen: false,
            height: 420,
            width: 650,
            modal: true,
            closeOnEscape: true,
            open: function() {
                var $node = jQuery(tinyMCE.activeEditor.selection.getNode());
                if ($node.hasClass('agifinline')) {
                    jQuery('#agifinline-result').html('');
                    jQuery('#agifinline-href').val($node.attr('href'));
                    img = jQuery('<a href="javascript:void(0);" class="agifinline-image" />').html('<img src="' + $node.data('gif') + '" />');
                    img.click(function() {
                        $selected = $node.data('gif');
                        jQuery(this).addClass('active');
                        jQuery('#agifinline-submit').removeClass('button-disabled').addClass('button-primary');
                    });
                    div = jQuery('<div>').append(img);
                    jQuery('#agifinline-result').append(div);
                }
            }
        });

        var searchGif = function(term, offset) {
            if (term.length <= 2) return false;

            var offset = (typeof(offset) == 'undefined') ? 0 : offset;
            $xhr = jQuery.get('http://api.giphy.com/v1/gifs/search?q=' + term + '&offset=' + offset + '&api_key=dc6zaTOxFJmzC');
            $xhr.done(function(result) {
                if (offset == 0) {
                    jQuery('#agifinline-result').html('');
                }
                jQuery('#agifinline-more').remove();
                if (result.pagination.total_count > 0) {
                    jQuery.each(result.data, function(k, item) {
                        img = jQuery('<a href="javascript:void(0);" class="agifinline-image" />').html('<img src="' + item.images.fixed_height.url + '" />');
                        img.click(function() {
                            $selected = item.images.original.url;
                            jQuery('.agifinline-image').removeClass('active');
                            jQuery(this).addClass('active');
                            jQuery('#agifinline-submit').removeClass('button-disabled').addClass('button-primary');
                        });
                        div = jQuery('<div>').append(img);
                        jQuery('#agifinline-result').append(div);
                    });

                    if (result.pagination.total_count > result.pagination.count) {
                        more = jQuery('<div id="agifinline-more"><a href="javascript:void(0);" id="agifinline-load-more">Load more...</a></li>')
                        more.click(function() {
                            jQuery(this).html('<img src="images/loading.gif" />');
                            searchGif(term, (offset + 1));
                        });
                        jQuery('#agifinline-result').append(more);
                    }

                } else {
                    jQuery('#agifinline-result').html('<div id="agifinline-placeholder">No results, try again.</a></li>');
                }

            });
        };

        form.find('#agifinline-search').on('keyup', function(event) {
            if (typeof($xhr) != 'undefined') {
                $xhr.abort();
            }

            jQuery('#agifinline-result').html('<img src="images/loading.gif" />');

            if (/(https?:\/\/[^\s]+)/g.test(jQuery(this).val())) {
                $url = jQuery(this).val();
                $xhr = jQuery.get($url);
                $xhr.success(function() {
                    jQuery('#agifinline-result').html('');
                    img = jQuery('<a href="javascript:void(0);" class="agifinline-image" />').html('<img src="' + $url + '" />');
                    img.click(function() {
                        $selected = $url;
                        jQuery('.agifinline-image').removeClass('active');
                        jQuery(this).addClass('active');
                        jQuery('#agifinline-submit').removeClass('button-disabled').addClass('button-primary');
                    });
                    div = jQuery('<div>').append(img);
                    jQuery('#agifinline-result').append(div);
                });
            } else {
                if (jQuery(this).val().length > 2) {

                    var term = encodeURIComponent(jQuery(this).val());
                    searchGif(term, 0);
                }
            }

        });

        form.find('#agifinline-submit').click(function() {
            selectedText = tinyMCE.activeEditor.selection.getContent();

            if (selectedText) {
                // agrega el contenido al texto seleccionado
                $url = (jQuery('#agifinline-href').val() != '') ? jQuery('#agifinline-href').val() : $selected;
                tinyMCE.activeEditor.execCommand('mceReplaceContent', 0, '<a href="' + $url + '" data-gif="' + $selected + '" class="agifinline" />{$selection}</a>');
            } else {
                // agrega la imágen
                tinyMCE.activeEditor.execCommand('mceInsertContent', 0, '<img src="' + $selected + '" />');
            }


            // cierra el thickbox
            jQuery('#agifinline-form').dialog('close');
        });

        form.find('#agifinline-cancel').click(function() {
            jQuery('#agifinline-form').dialog('close');
        });
    });

})();
