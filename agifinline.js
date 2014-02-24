jQuery(document).ready(function() {
    var gif = jQuery('<div id="agifinline" />');
    gif.hide();
    gif.css('position', 'absolute').css('box-shadow', '1px 1px 2px #444');
    jQuery('body').append(gif);

    jQuery('a.agifinline').mouseover(function(event) {});

    jQuery('a.agifinline').mousemove(function(event) {
        jQuery('#agifinline').html('<img src="' + jQuery(this).data('gif') + '" />');
        gw = jQuery('#agifinline img').width();
        gh = jQuery('#agifinline img').height();
        var left = event.pageX - (gw / 2);
        var top = event.pageY + 20;
        gif.css('height', gh);
        gif.css('left', left);
        gif.css('top', top);
        gif.show();
    });

    jQuery('a.agifinline').mouseout(function(event) {
        gif.hide();
    });
});
