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
        <ToolsPanel label="Overlay & Background" resetAll={ handleReset }>
            <ToolsPanelItem
                label="Overlay Color" 
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
                    label={__('Overlay Color', 'text-domain')}
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
                        label={__('Dark', 'text-domain')}
                    />
                    <ToggleGroupControlOption
                        value="light"
                        label={__('Light', 'text-domain')}
                    />
                </ToggleGroupControl>
            </ToolsPanelItem>

            <ToolsPanelItem 
                label="Overlay Opacity"
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
                    label={__('Overlay Opacity', 'text-domain')}
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