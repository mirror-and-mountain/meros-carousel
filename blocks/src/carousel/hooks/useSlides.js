import { useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';

import { getPostInfo } from '../utils/getPostInfo.js';
import { makeBlocks } from '../utils/makeBlocks.js';
import { useFeaturedImages } from './useFeaturedImages.js';

export function useSlides(
    clientId, 
    containerRef, 
    carouselType,
    useParallax,
    featuredImagesConfig, 
    savedBlocks, 
    mountedBlocks, 
    setAttributes, 
) {
    const hasInitialised       = useRef(false);
    const hasLoadedExisting    = useRef(false);
    const carouselTypeRef      = useRef(null);
    const containerObserverRef = useRef(null);
    const [slides, setSlides]  = useState([]);
    const [slideBlocks, setSlideBlocks] = useState([]);
    const [templateBlock, setTemplateBlock] = useState(null);
    
    const { removeBlocks, replaceInnerBlocks } = useDispatch('core/block-editor');
    
    useFeaturedImages(slides, useParallax, featuredImagesConfig);

    useEffect(() => {
        const hasBlocks = !!mountedBlocks?.length;
    
        if (hasBlocks) {
            // Previously saved blocks — set them and skip replacing
            setSlideBlocks(mountedBlocks);
            hasLoadedExisting.current = true;
        }
        
        hasInitialised.current = true;
        carouselTypeRef.current = carouselType;

    }, []);
  
    // Sets slide innerBlocks
    useEffect(() => {
        if (!carouselType || !hasInitialised.current) return;

        const typeChanged = carouselTypeRef.current !== carouselType;
        const isNewBlock  = !hasLoadedExisting.current;

        if (typeChanged || isNewBlock) {
            const blocks = makeBlocks(carouselType, savedBlocks?.[carouselType]);

            if (mountedBlocks.length > 0) {
                removeBlocks(mountedBlocks.map((block) => block.clientId));
            }

            replaceInnerBlocks(clientId, blocks);
            setSlideBlocks(blocks);

            carouselTypeRef.current = carouselType;
            hasLoadedExisting.current = false;
        }

    }, [carouselType]);

    // Sets slides
    useEffect(() => {
        if (slideBlocks.length === 0 || !containerRef.current) return;
    
        // Clean up any existing observers
        if (containerObserverRef.current instanceof MutationObserver) {
            containerObserverRef.current.disconnect();
            containerObserverRef.current = null;
            setTemplateBlock(null);
        }
    
        if (carouselType === 'static') {
            const slideElements = Array.from(containerRef.current.querySelectorAll('.meros-carousel-slide'));
            const slideObjects = slideElements.map((el) => ({
                element: el, backgroundImage: null, id: null, type: null
            }));
    
            setSlides(slideObjects);
        } 
        
        else if (carouselType === 'dynamic') {
            containerObserverRef.current = createContainerObserver(
                containerRef, templateBlock, setSlides, setTemplateBlock
            );
    
            containerObserverRef.current.observe(containerRef.current, {
                childList: true,
                subtree: true
            });
        }
    
        return () => {
            if (containerObserverRef.current instanceof MutationObserver) {
                containerObserverRef.current.disconnect();
                containerObserverRef.current = null;
                setTemplateBlock(null)
            }
        };
    }, [slideBlocks, templateBlock]);
    
    // Persists slide config
    useEffect(() => {
        if (!mountedBlocks?.length) return;

        if (JSON.stringify(savedBlocks?.[carouselType]) !== JSON.stringify(mountedBlocks)) {
            setAttributes({
                savedBlocks: {
                    ...savedBlocks,
                    [carouselType]: mountedBlocks
                }
            });
            setSlideBlocks(mountedBlocks);
        }
    },[mountedBlocks]);

    return slides;
}

function createContainerObserver(containerRef, currentTemplateBlock, setSlides, setTemplateBlock) {
    return new MutationObserver(() => {
        const queryBlock = containerRef.current.querySelector('.meros-carousel-dynamic-query');
        const templateBlock = queryBlock?.querySelector('.meros-carousel-dynamic-template');

        if (!queryBlock || !templateBlock || templateBlock.tagName !== 'UL') return;

        if (templateBlock !== currentTemplateBlock) {
            setTemplateBlock(templateBlock);

            const slideObjects = Array.from(templateBlock.getElementsByTagName('li') || [])
                .filter((el) => el.style.display !== 'none')
                .map((el) => {
                    const postInfo = getPostInfo(el) || {};

                    return { 
                        element: el,
                        backgroundImage: null,
                        id: postInfo?.id, 
                        type: postInfo?.type 
                    };
                });

            setSlides(slideObjects);
        }
    });
}
