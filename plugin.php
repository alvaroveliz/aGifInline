<?php
/**
 * Plugin Name: aGifInline
 * Plugin URI: http://alvaroveliz.cl
 * Description: Alvaro's Gif Inline
 * Version: 1.0
 * Author: Alvaro Véliz
 * Author URI: http://alvaroveliz.cl
 * License: MIT
 */

function aGifInlineAddButton()
{
    if ( current_user_can('edit_posts') &&  current_user_can('edit_pages') )
    {
        add_filter('mce_external_plugins', 'aGifInlineButtonPlugin');
        add_filter('mce_buttons', 'aGifInlineRegisterButton');
    }
 }

function aGifInlineButtonPlugin($plugin_array)
{
    $plugin_array['agifinline'] = plugins_url('agifinline_admin.js', __FILE__);
    return $plugin_array;
}

function aGifInlineRegisterButton($buttons)
{
    array_push($buttons, 'agifinline');
    return $buttons;
}

add_action('init', 'aGifInlineAddButton');

function aGifInlineAdminStyles()
{    
    wp_register_style( 'agifinline-style', plugins_url('agifinline_admin.css', __FILE__) );
    wp_enqueue_style( 'agifinline-style' );       
}

add_action('admin_enqueue_scripts', 'aGifInlineAdminStyles');

function aGifInlineScripts()
{    
    wp_register_script( 'agifinline-script', plugins_url('agifinline.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'agifinline-script' );       
}

add_action('wp_enqueue_scripts', 'aGifInlineScripts');