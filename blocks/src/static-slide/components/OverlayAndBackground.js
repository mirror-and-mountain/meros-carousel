import { __ } from '@wordpress/i18n';
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalToggleGroupControl as ToggleGroupControl, 
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    RangeControl
} from '@wordpress/components';

export function OverlayAndBackground({ attributes, setAttributes }) {

    const { style } = attributes;

    const handleReset = () => {
        setAttributes({
            style: {
                ...style,
                overlay: {
                    color: "dark",
                    opacity: 20
                }
            }
        });
    }

    return (
        <ToolsPanel label={__('Overlay & Background', 'meros-carousel' )} resetAll={ handleReset }>
            <ToolsPanelItem
                label={__('Overlay Colour', 'meros-carousel' )} 
                hasValue={() => 
                    style?.overlay?.color !== 'dark' ? true : false
                } 
                isShownByDefault={ true }
                onDeselect={() => {
                    setAttributes({
                        style: {
                            ...style,
                            overlay: {
                                ...style?.overlay,
                                color: "dark"
                            }
                        }
                    });
                }}
            >
                <ToggleGroupControl
                    label={__('Overlay Colour', 'meros-carousel')}
                    value={style?.overlay?.color}
                    onChange={(color) => {
                        setAttributes({
                            style: {
                                ...style,
                                overlay: {
                                    ...style?.overlay,
                                    color: color
                                }
                            }
                        });
                    }}
                    isBlock // or isCompact, depending on your UI preference
                >
                    <ToggleGroupControlOption
                        value="dark"
                        label={__('Dark', 'meros-carousel')}
                    />
                    <ToggleGroupControlOption
                        value="light"
                        label={__('Light', 'meros-carousel')}
                    />
                </ToggleGroupControl>
            </ToolsPanelItem>

            <ToolsPanelItem 
                label={__('Overlay Opacity', 'meros-carousel' )}
                hasValue={() => 
                    style?.overlay?.opacity !== 20 ? true : false
                }  
                isShownByDefault={ true }
                onDeselect={() => {
                    setAttributes({
                        style: {
                            ...style,
                            overlay: {
                                ...style?.overlay,
                                opacity: 20
                            }
                        }
                    });
                }}
            >
                <RangeControl
                    label={__('Overlay Opacity', 'meros-carousel' )}
                    value={style?.overlay?.opacity ?? 20}
                    onChange={(value) => setAttributes({
                        style: {
                            ...style,
                            overlay: {
                                ...style?.overlay,
                                opacity: value !== undefined ? value : 0
                            }
                        }
                    })}
                    min={0}
                    max={100}
                    step={5}
                />
            </ToolsPanelItem>
        </ToolsPanel>
    );
}