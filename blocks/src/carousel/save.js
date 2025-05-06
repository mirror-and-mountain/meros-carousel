import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Save({ attributes }) {

    const {
        carouselType,
        carouselOptions,
        spaOptions,
        useParallax,
        alignSlideContent,
        style       
    } = attributes;

    const {
        animationType,
        animationSpeed,
        autoPlay,
        interval,
        showNav,
        showIndicators
    } = carouselOptions;

    const {
        matchPost
    } = spaOptions;

    const instanceOptions = JSON.stringify(
        { animationType, animationSpeed, autoPlay, interval, matchPost, useParallax }
    );

    const navOptions = JSON.stringify(showNav);
    const indicatorOptions = JSON.stringify(showIndicators);

    const overlayOpacity = (style?.overlay?.opacity ?? 20) / 100;
	const isDark = style?.overlay?.color === 'dark';
	const overlayColor = isDark
		? `rgba(0, 0, 0, ${overlayOpacity})`
		: `rgba(255, 255, 255, ${overlayOpacity})`;

    return (
        <div 
            {...useBlockProps.save({ 
                className: 'meros-carousel',
                'data-type': carouselType,
                'data-options': instanceOptions,
                'data-nav': navOptions,
                'data-indicators': indicatorOptions,
                'data-overlay': overlayColor,
                'data-align': alignSlideContent || 'center'
                })}
        >
            <InnerBlocks.Content />
            <div className="meros-carousel-navigation">
                <button className="meros-carousel-prev" type="button">
                    <span className="meros-carousel-prev-icon">
                        <svg className="meros-carousel-prev-icon-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                        </svg>
                    </span>
                </button>
                <button className="meros-carousel-next" type="button">
                    <span className="meros-carousel-next-icon">
                        <svg className="meros-carousel-next-icon-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l4 4-4 4" />
                        </svg>
                    </span>
                </button>
            </div>
            <div className="meros-carousel-indicators"></div>
        </div>
    );
}