import { useRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { useHeightAdjust } from './hooks/useHeightAdjust.js';
import { useVisibility } from './hooks/useVisibility.js';
import { useSlides } from './hooks/useSlides.js';
import { initCarousel, goToNext, goToPrev } from './classes/MerosCarouselEditor.js';
import { CarouselControls } from './components/CarouselControls.js';

import './style.scss';

export default function Edit ({attributes, setAttributes, clientId}) {
    const containerRef  = useRef(null); // The carousel container element
    const carouselRef   = useRef(null); // The MerosCarousel instance
    const navRef        = useRef(null); // The carousel nav elements
    const indicatorRef  = useRef(null); // The carousel indicator elements

    /* Retreives innerBlocks and the block selected in the editor */
    const { mountedBlocks, selectedBlock } = useSelect((select) => {
        const editor = select('core/block-editor');
        return {
            mountedBlocks: editor.getBlocks(clientId) || [],
            selectedBlock: editor.getSelectedBlockClientId()
        };
    },[clientId]);

    /* Attributes */
    const {
        carouselType,
        carouselOptions,
        useParallax,
        savedBlocks,
        alignSlideContent,
        style
    } = attributes;

    /* Carousel height */
    const carouselHeight = style?.dimensions?.minHeight || '450px';

    /* Whether to use featured images as slide background */
    const featuredImagesConfig = carouselOptions?.featuredImages;
  
    /* Slide objects */
    const carouselSlides = useSlides(
        clientId, 
        containerRef, 
        carouselType,
        useParallax,
        featuredImagesConfig, 
        savedBlocks, 
        mountedBlocks,
        setAttributes
    );
    
    useVisibility(navRef, carouselOptions?.showNav);
    useVisibility(indicatorRef, carouselOptions?.showIndicators);
    useHeightAdjust(carouselRef.current, carouselHeight);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !carouselSlides?.length ) return;
        
        const slides   = carouselSlides.map((slide) => slide.element);
        const instance = carouselRef.current;
        const options  = {
            animationType: carouselOptions?.animationType || 'slide',
            animationSpeed: carouselOptions?.animationSpeed || 300,
            autoPlay: false,
            interval: carouselOptions?.interval || 5000,
            matchPost: false,
            useParallax: useParallax
        };

        carouselRef.current = initCarousel(
            instance, container, slides, options
        );
    }, [carouselSlides, clientId]);

    /* Ensures the selected slide block is visible in the editor.
     * Only relevant for the static banner type.
     */
    useEffect(() => {
        if (carouselType !== 'static') return;
        // Check if the selected block is a slide
        if (!carouselRef.current || !selectedBlock) return;
        // Check if the selected block is a slide innerBlock
        const selectedIndex = mountedBlocks.findIndex(
            (block) =>
                block.clientId === selectedBlock ||
                block.innerBlocks.some(
                    (inner) => [
                        inner.clientId, 
                        ...inner.innerBlocks.map((deep) => deep.clientId)
                    ].includes(selectedBlock)
                )
        );

        // Go to the selected slide
        if (selectedIndex !== -1) {
            carouselRef.current.goToSlide(selectedIndex);
        }
    },[selectedBlock]);


    const styles = {
        ...style,
        "visibility": 'visible',
        "--overlay-color": style?.overlay?.color === "dark" ? "0, 0, 0" : "255, 255, 255",
        "--overlay-opacity": (style?.overlay?.opacity ?? 20) / 100,
        "--align-slide-content": alignSlideContent || 'center'
    }

    return (
        <>
            <CarouselControls
                attributes={attributes}
                setAttributes={setAttributes}
                instance={carouselRef.current}
            />

            <div { ...useBlockProps({ className: 'meros-carousel', style: styles })} ref={ containerRef } >
                <InnerBlocks 
                    orientation="horizontal" 
                    allowedBlocks={['meros/static-slide', 'meros/dynamic-slide']}
                />
                <div className="meros-carousel-navigation" ref={ navRef }>
                    <button className="meros-carousel-prev" type="button" onClick={() => goToPrev(carouselRef.current)}>
                        <span className="meros-carousel-prev-icon">
                            <svg className="meros-carousel-prev-icon-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </span>
                    </button>
                    <button className="meros-carousel-next" type="button" onClick={() => goToNext(carouselRef.current)}>
                        <span className="meros-carousel-next-icon">
                            <svg className="meros-carousel-next-icon-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4-4 4" />
                            </svg>
                        </span>
                    </button>
                </div>
                <div className="meros-carousel-indicators" ref={ indicatorRef }></div>
            </div>
        </>
    );
}