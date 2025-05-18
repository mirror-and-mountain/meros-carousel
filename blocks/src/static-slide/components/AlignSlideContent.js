import { __ } from '@wordpress/i18n';
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    SelectControl
} from '@wordpress/components';

export function AlignSlideContent({ attributes, setAttributes }) {
    
    const alignSlideContent = attributes.alignSlideContent || 'center';

    const setValue = (value = 'center') => {
        setAttributes({
            alignSlideContent: value
        });
    }

    return (
        <ToolsPanel label={__('Align Slide Content', 'meros-carousel' )} resetAll={setValue}>
            <ToolsPanelItem
                label={__('Align Slide Content', 'meros-carousel' )}
                hasValue={() => 
                    alignSlideContent !== 'center' ? true : false
                }
                isShownByDefault={true}
                onDeselect={setValue}
            >
                <SelectControl
                    label={__('Position', 'meros-carousel' )}
                    value={ alignSlideContent }
                    options={[
                        { label: 'Top', value: 'start' },
                        { label: 'Center', value: 'center' },
                        { label: 'Bottom', value: 'end' }
                    ]}
                    onChange={(value) =>
                        setValue(value)
                    }
                />
            </ToolsPanelItem>
        </ToolsPanel>
    );
}