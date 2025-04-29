import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { CarouselSettings } from './CarouselSettings.js';
import { NavigationSettings } from './NavigationSettings.js';

import { AlignSlideContent } from './AlignSlideContent.js';
import { OverlayAndBackground } from './OverlayAndBackground.js';
import { updateOption as updateCarouselOption } from '../classes/MerosCarouselEditor.js';

export function CarouselControls({ attributes, setAttributes, instance }) {

    const carouselType = attributes?.carouselType || 'static';

    const updateOption = (attribute, value, updateInstance = false) => {
        if (attribute.includes('.')) {
            const [parentKey, childKey] = attribute.split('.');
    
            setAttributes({
                [parentKey]: {
                    ...(attributes[parentKey] || {}),
                    [childKey]: value
                }
            });
    
            if (updateInstance) {
                updateCarouselOption(instance, childKey, value);
            }
        } else {
            setAttributes({ [attribute]: value });
    
            if (updateInstance) {
                updateCarouselOption(instance, attribute, value);
            }
        }
    };

    return (
        <>
            <InspectorControls>
                <CarouselSettings
                    attributes={attributes}
                    setAttributes={setAttributes}
                    updateOption={updateOption}
                />
                <NavigationSettings
                    attributes={attributes}
                    setAttributes={setAttributes}
                    updateOption={updateOption}
                />
            </InspectorControls>
            {carouselType === 'dynamic' && (
                <InspectorControls group="styles">
                    <AlignSlideContent
                        attributes={attributes}
                        setAttributes={setAttributes}
                    />
                </InspectorControls>
            )}
            <InspectorControls group="styles">
                <OverlayAndBackground
                    attributes={attributes}
                    setAttributes={setAttributes}
                    updateOption={updateOption}
                />
            </InspectorControls>
        </>
    );
};