import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

import { AlignSlideContent } from './AlignSlideContent.js';
import { OverlayAndBackground } from './OverlayAndBackground.js';

export const SlideControls = ({ attributes, setAttributes }) => {
    
    const { videoUrl, style } = attributes;

    return (
        <InspectorControls group="styles">
            <AlignSlideContent 
                attributes={attributes}
                setAttributes={setAttributes}
            />
            <OverlayAndBackground
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </InspectorControls>
    );
}