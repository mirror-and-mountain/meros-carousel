<?php

function meros_carousel_define_constants(): void {
    defined('MEROS_CAROUSEL_PATH') || define('MEROS_CAROUSEL_PATH', dirname(__DIR__));
    defined('MEROS_CAROUSEL_URI')  || defined('MEROS_BASEURI') 
                                      ? define('MEROS_CAROUSEL_URI', MEROS_BASEURI . '/plugins/' . basename(dirname(__DIR__))) 
                                      : plugin_dir_url(dirname(__DIR__));
}

function meros_carousel_register_blocks() {

    $blocks_path = wp_normalize_path(MEROS_CAROUSEL_PATH . '/blocks/build/');

    foreach( ['carousel', 'static-slide'] as $block ) {
        $path = $blocks_path . $block;
        register_block_type( $path );
    }
}

function meros_carousel_register_scripts() {

    $assets_path = wp_normalize_path(MEROS_CAROUSEL_PATH . '/assets/build/');
    $src         = MEROS_CAROUSEL_URI . '/assets/build/editor/index.js';
    $path        = wp_normalize_path($assets_path . 'editor/index.js');

    wp_enqueue_script(
        'meros_carousel_query_variation',
        $src,
        ['wp-blocks', 'wp-hooks'],
        filemtime($path)
    );
}

meros_carousel_define_constants();
add_action('enqueue_block_editor_assets', 'meros_carousel_register_scripts');
add_action('init', 'meros_carousel_register_blocks');