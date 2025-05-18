<?php
/**
 * Returns the plugin's path.
 *
 * @return string
 */
function get_meros_carousel_path(): string {
    return dirname(__DIR__);
}

/**
 * Provides a modified URI if the plugin is installed in a Meros powered theme.
 * This is required for properly enqueuing assets.
 *
 * @return string
 */
function get_meros_carousel_uri(): string {
    if ( dirname(__DIR__, 4) === WP_CONTENT_DIR . '/themes' ) {
        return get_theme_file_uri( '/plugins/' . basename(dirname(__DIR__)) );
    }
    else {
        return plugin_dir_url(dirname(__DIR__));
    }
}

/**
 * Registers the meros carousel block.
 *
 * @return void
 */
function meros_carousel_register_blocks() {

    $blocks_path = wp_normalize_path(get_meros_carousel_path() . '/blocks/build/');

    foreach( ['carousel', 'static-slide'] as $block ) {
        $path = $blocks_path . $block;
        register_block_type( $path );
    }
}

/**
 * Enqueues the query block variation for dynamic slides.
 *
 * @return void
 */
function meros_carousel_enqueue_scripts() {

    $assets_path = wp_normalize_path(get_meros_carousel_path() . '/assets/build/');
    $src         = trailingslashit(get_meros_carousel_uri()) . 'assets/build/editor/index.js';
    $path        = wp_normalize_path($assets_path . 'editor/index.js');

    wp_enqueue_script(
        'meros_carousel_query_variation',
        $src,
        ['wp-blocks', 'wp-hooks'],
        filemtime($path)
    );
}

add_action('enqueue_block_editor_assets', 'meros_carousel_enqueue_scripts');
add_action('init', 'meros_carousel_register_blocks');