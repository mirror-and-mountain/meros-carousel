import { createBlock, getBlockVariations } from '@wordpress/blocks';

export function makeBlocks(carouselType, savedBlocks) {
    if (carouselType === 'static') {
        return makeStaticBlocks(savedBlocks);
    }
    if (carouselType === 'dynamic') {
        return makeDynamicBlocks(savedBlocks);
    }
}

function makeStaticBlocks(savedBlocks) {
    const existingBlocks = makeSavedBlocks(savedBlocks);
    if (existingBlocks.length > 0) {
        return existingBlocks;
    }
    
    return Array.from(
        { length: 3 },
        () => createBlock('meros/static-slide')
    );
}

function makeDynamicBlocks(savedBlocks) {
    const queryVars       = getBlockVariations('core/query'); // core/query block variations
    const dynamicVar      = queryVars.find((v) => v.name === 'meros/dynamic-slide'); // The dynamic slide variation
    const dynamicAttrs    = dynamicVar?.attributes || {}; // The attributes for the dynamic slide
    const dynamicTemplate = dynamicVar?.innerBlocks || []; // The inner blocks for the dynamic slide

    const existingBlocks = makeSavedBlocks(savedBlocks);
    
    if (existingBlocks.length > 0) {
        return existingBlocks;
    }

    const createInnerBlocksFromTemplate = (blocks) => {
        return blocks?.map(([name, attributes, innerBlocks]) => 
            createBlock(name, attributes, createInnerBlocksFromTemplate(innerBlocks) || [])
        ) || [];
    };

    const template = createInnerBlocksFromTemplate(dynamicTemplate);
    return [createBlock('core/query', dynamicAttrs, template)];
}

function makeSavedBlocks(savedBlocks) {
    return savedBlocks.map((block) =>
        createBlock(block.name, block.attributes, block.innerBlocks)
    ) || [];
}