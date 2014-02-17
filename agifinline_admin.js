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
                        <ul id="agifinline-result">\
                            <li id="agifinline-placeholder">Search gifs using #tags or categories.<br />Powered by <a href="http://giphy.com/">Giphy.com</a></li>\
                        </ul>\
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
        var $xhr;
        var $selected;
        form.appendTo('body').hide();

        jQuery(form).dialog({
            dialogClass: 'wp-dialog',
            autoOpen: false,
            height: 370,
            width: 650,
            modal: true,
            closeOnEscape: true
        });

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
                    li = jQuery('<li>').append(img);
                    jQuery('#agifinline-result').append(li);
                });
            } else {
                if (jQuery(this).val().length > 3) {

                    var term = encodeURIComponent(jQuery(this).val());
                    $xhr = jQuery.get('http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC');
                    $xhr.done(function(result) {
                        jQuery('#agifinline-result').html('');
                        jQuery.each(result.data, function(k, item) {
                            img = jQuery('<a href="javascript:void(0);" class="agifinline-image" />').html('<img src="' + item.images.fixed_height.url + '" />');
                            img.click(function() {
                                $selected = item.images.original.url;
                                jQuery('.agifinline-image').removeClass('active');
                                jQuery(this).addClass('active');
                                jQuery('#agifinline-submit').removeClass('button-disabled').addClass('button-primary');
                            });
                            li = jQuery('<li>').append(img);
                            jQuery('#agifinline-result').append(li);
                        });
                    })
                }
            }

        });

        form.find('#agifinline-submit').click(function() {
            selectedText = tinyMCE.activeEditor.selection.getContent();

            if (selectedText) {
                // agrega el contenido al text seleccionado
                tinyMCE.activeEditor.execCommand('mceReplaceContent', 0, '<a href="' + $selected + '" class="agifinline" />{$selection}</a>');
            } else {
                // agrega la imágen
                tinyMCE.activeEditor.execCommand('mceInsertContent', 0, '<img src="' + $selected + '" />');
            }


            // cierra el thickbox
            jQuery('#agifinline-form').dialog('close');
        });

        form.find('#agifinline-cancel').click(function(){
            jQuery('#agifinline-form').dialog('close');
        });
    });

})();
