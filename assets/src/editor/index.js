import { addFilter } from '@wordpress/hooks';
import { registerBlockVariation } from '@wordpress/blocks';
import { addBorderSupportForReadMore } from './blockMods.js';

import variation from './variation.json';
import innerBlocks from './innerBlocks.json';

// Function to transform innerBlocks to the correct format
const transformInnerBlocks = (blocks) => {
    return blocks.map(block => [
        block.name,
        block.attributes || {},
        block.innerBlocks ? transformInnerBlocks(block.innerBlocks) : []
    ]);
};

// Update the variation's innerBlocks
const metadata = {
    ...variation,
    innerBlocks: transformInnerBlocks(innerBlocks)
};

registerBlockVariation('core/query', metadata);

addFilter(
	'blocks.registerBlockType',
	'meros-carousel/read-more-mod',
	addBorderSupportForReadMore,
);