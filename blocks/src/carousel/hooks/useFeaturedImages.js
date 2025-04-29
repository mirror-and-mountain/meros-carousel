import { useEntityRecords } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';

export function useFeaturedImages(slides, useParallax, config) {
    
    const {
        enabled,
        size,
        position,
        repeat
    } = config;

    const { records: posts, isResolving: loadingPosts } = useEntityRecords('postType', 'post', {
        include: slides.filter(item => item?.type === 'post').map((item) => item?.id)
    });

    const { records: pages, isResolving: loadingPages } = useEntityRecords('postType', 'page', {
        include: slides.filter(item => item?.type === 'page').map((item) => item?.id)
    });

    const combined = [
        ...(posts?.map((post) => {
            if (!post.featured_media) return null;
            return { postID: post.id, mediaID: post.featured_media };
        }) || []),
        ...(pages?.map((page) => {
            if (!page.featured_media) return null;
            return { postID: page.id, mediaID: page.featured_media }
        }) || [])
    ].filter(Boolean);

    const { records: featuredMedia, isResolving: loadingFeaturedMedia } = useEntityRecords('root', 'media', {
        include: combined.map((item) => item.mediaID)
    });

    useEffect(() => {
        if (loadingFeaturedMedia) return;

        const clearParallaxBg = (el) => {
            if (!el) return;
            const parallaxBg = el.querySelector('.meros-carousel-parallax-bg');
            if (parallaxBg) {
                parallaxBg.remove();
            }
        };

        if (!enabled) {
            const updatedSlides = slides;
            updatedSlides.forEach((slide) => {
                if (slide?.element?.style) {
                    slide.element.style.background = '';
                }
                clearParallaxBg(slide?.element);
            });
            return;
        }

        if (!featuredMedia?.length) return;
    
        // Build a map of postID → imageURL by linking combined + featuredMedia
        const imageFromPostID = combined.reduce((acc, record) => {
            const media = featuredMedia.find((m) => m.id === record.mediaID);
            if (media) {
                acc[record.postID] = media.source_url;
            }
            return acc;
        }, {});
    
        // Update the slides with their background images
        const updatedSlides = slides.map((slide) => {
            return {
                ...slide,
                backgroundImage: imageFromPostID[slide.id] || null
            };
        });
    
        updatedSlides.forEach((slide) => {
            if (slide.element && slide.backgroundImage) {
                
                clearParallaxBg(slide.element);
                slide.element.style.background = '';

                const bg = useParallax
                ? document.createElement('div')
                : slide.element; 

                bg.style.backgroundImage    = `url('${slide.backgroundImage}')`;
                bg.style.backgroundSize     = useParallax ? 'cover' : size || 'cover';
                bg.style.backgroundPosition = useParallax ? 'center' : position || 'center';
                bg.style.backgroundRepeat   = useParallax ? 'no-repeat' : repeat || 'no-repeat';

                if (
                    useParallax && 
                    !slide.element.querySelector('.meros-carousel-parallax-bg')
                ) {
                    bg.style.zIndex = -20;
                    bg.classList.add('meros-carousel-parallax-bg');
                    slide.element.appendChild(bg);
                }
            }
        });
    
    }, [featuredMedia, loadingFeaturedMedia, combined, slides, useParallax, config]);
}