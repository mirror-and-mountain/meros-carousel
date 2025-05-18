<?php
/**
 * Ensures featured image options are available when the block is rendered.
 */
add_filter('render_block_data', function ( $block ) {
    static $carouselContext = null;

    if ($block['blockName'] === 'meros/carousel') {
        $carouselType = $block['attrs']['carouselType'] ?? 'static';

        if ($carouselType === 'dynamic') {
            $carouselContext = $block['attrs']['carouselOptions']['featuredImages'] ?? null;
        } else {
            $carouselContext = null;
        }
    }

    if ($block['blockName'] === 'core/post-template' && $carouselContext) {
        // Inject our context into the block's attrs
        $block['attrs']['__carouselFeaturedImageSettings'] = $carouselContext;
    }

    return $block;
}, 10, 1);

/**
 * Gets featured image urls for slide styling when a dynamic
 * slide is used.
 */
add_filter('render_block', function ( $content, $block ) {
    if ($block['blockName'] !== 'core/post-template') {
        return $content;
    }

    $settings = $block['attrs']['__carouselFeaturedImageSettings'] ?? [
        'enabled'  => true,
        'size'     => 'cover',
        'position' => 'center'
    ];

    // Match each <li ...>...</li> block
    $content = preg_replace_callback(
        '/<li([^>]*)>(.*?)<\/li>/s',
        function ($matches) use ($settings) {
            $attributes = $matches[1];
            $innerHTML  = $matches[2];

            if (preg_match('/class="([^"]*)"/', $attributes, $class_match)) {
                $new_classes = trim($class_match[1] . ' meros-carousel-slide');
                $attributes = preg_replace('/class="[^"]*"/', 'class="' . esc_attr($new_classes) . '"', $attributes);
            } else {
                $attributes .= ' class="meros-carousel-slide"';
            }

            // Extract post ID from class="... post-42 ..."
            if (preg_match('/post-(\d+)/', $attributes, $id_match)) {
                $post_id = intval($id_match[1]);
                $image_url = get_the_post_thumbnail_url($post_id, 'full');

                if ($image_url) {
                    $style = sprintf(
                        'background-image: url(%s); background-size: %s; background-position: %s; background-repeat: %s;',
                        esc_url($image_url),
                        esc_attr($settings['size'] ?? 'cover'),
                        esc_attr($settings['position'] ?? 'center'),
                        esc_attr($settings['repeat'] ?? 'no-repeat')
                    );

                    return sprintf('<li %s style="%s">%s</li>', $attributes, esc_attr($style), $innerHTML);
                }
            }

            // No post ID or no image, return original
            return $matches[0];
        },
        $content
    );

    return $content;
}, 10, 2);  