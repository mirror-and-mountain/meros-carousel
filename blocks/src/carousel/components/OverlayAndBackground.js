import { __ } from '@wordpress/i18n';
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalToggleGroupControl as ToggleGroupControl, 
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    RangeControl,
    ToggleControl,
    SelectControl
} from '@wordpress/components';

export function OverlayAndBackground({ attributes, setAttributes, updateOption }) {

    const {
        carouselType,
        carouselOptions,
        useParallax,
        style
    } = attributes;

    const featuredImages = carouselOptions?.featuredImages;

    const handleReset = () => {
        setAttributes({
            style: {
                ...style,
                overlay: {
                    color: "dark",
                    opacity: 20
                }
            },
            carouselOptions: {
                ...carouselOptions,
                featuredImages: {
                    enabled: true,
                    size: 'cover',
                    position: 'center',
                    repeat: 'no-repeat'
                }
            }
        });

        updateOption('useParallax', true, true);
    }

    return (
        <ToolsPanel label={__('Overlay & Background', 'meros-carousel' )} resetAll={ handleReset }>
            {carouselType === 'dynamic' && (
                <>
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
                            label={__('Overlay Opacity', 'meros-carousel')}
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

                    <ToolsPanelItem 
                        label={__('Use Featured Images', 'meros-carousel')}
                        hasValue={() => 
                            !featuredImages.enabled ? true : false
                        }
                        isShownByDefault={ true }
                        onDeselect={() => 
                            setAttributes({
                                carouselOptions: {
                                    ...carouselOptions,
                                    featuredImages: {
                                        ...carouselOptions.featuredImages,
                                        enabled: true
                                    }
                                }
                            })
                        }
                    >
                        <ToggleControl
                            label={__('Use featured images as background', 'meros-carousel')}
                            checked={ featuredImages.enabled }
                            onChange={(value) => 
                                setAttributes({
                                    carouselOptions: {
                                        ...carouselOptions,
                                        featuredImages: {
                                            ...carouselOptions.featuredImages,
                                            enabled: value
                                        }
                                    }
                                })
                            }
                        />
                    </ToolsPanelItem>
                </>
            )}

            <ToolsPanelItem 
                label={__('Parallax Effect', 'meros-carousel')}
                hasValue={() => 
                    !useParallax ? true : false
                }
                isShownByDefault={ true }
                onDeselect={() => 
                    updateOption('useParallax', true, true)
                }
            >
                <ToggleControl
                    label={__('Use Parallax Effect', 'meros-carousel')}
                    checked={ useParallax }
                    onChange={(value) => 
                        updateOption('useParallax', value, true)
                    }
                    disabled={carouselType === 'dynamic' && !featuredImages.enabled}
                />
            </ToolsPanelItem>

            {carouselType === 'dynamic' &&(
                <>
                    <ToolsPanelItem 
                        label={__('Background Size', 'meros-carousel')}
                        hasValue={() => 
                            featuredImages.size !== 'cover' ? true : false
                        }
                        isShownByDefault={ true }
                        onDeselect={() => 
                            setAttributes({
                                carouselOptions: {
                                    ...carouselOptions,
                                    featuredImages: {
                                        ...carouselOptions.featuredImages,
                                        size: 'cover'
                                    }
                                }
                            })
                        }
                        >
                        <SelectControl
                            label={__('Background Size', 'meros-carousel')}
                            value={ featuredImages?.size || 'cover' }
                            options={[
                                { label: 'Cover', value: 'cover' },
                                { label: 'Contain', value: 'contain' }
                            ]}
                            onChange={(value) => 
                                setAttributes({
                                    carouselOptions: {
                                        ...carouselOptions,
                                        featuredImages: {
                                            ...carouselOptions.featuredImages,
                                            size: value
                                        }
                                    }
                                })
                            }
                            disabled={!featuredImages.enabled || featuredImages.parallax}
                        />
                    </ToolsPanelItem>

                    <ToolsPanelItem 
                        label={__('Background Position', 'meros-carousel')}
                        hasValue={() => 
                            featuredImages.position !== 'center' ? true : false
                        }
                        isShownByDefault={ true }
                        onDeselect={() => 
                            setAttributes({
                                carouselOptions: {
                                    ...carouselOptions,
                                    featuredImages: {
                                        ...carouselOptions.featuredImages,
                                        position: 'center'
                                    }
                                }
                            })
                        }
                        >
                            <SelectControl
                                label={__('Background Position', 'meros-carousel')}
                                value={ featuredImages?.position || 'center' }
                                options={[
                                    { label: 'Center', value: 'center' },
                                    { label: 'Left', value: 'left' },
                                    { label: 'Right', value: 'right' }
                                ]}
                                onChange={(value) => 
                                    setAttributes({
                                        carouselOptions: {
                                            ...carouselOptions,
                                            featuredImages: {
                                                ...carouselOptions.featuredImages,
                                                position: value
                                            }
                                        }
                                    })
                                }
                                disabled={!featuredImages?.enabled || featuredImages?.size === 'cover'}
                            />
                    </ToolsPanelItem>

                    <ToolsPanelItem 
                        label={__('Background Repeat', 'meros-carousel')}
                        hasValue={() => 
                            featuredImages.repeat !== 'no-repeat' ? true : false
                        }
                        isShownByDefault={ true }
                        onDeselect={() => 
                            setAttributes({
                                carouselOptions: {
                                    ...carouselOptions,
                                    featuredImages: {
                                        ...carouselOptions.featuredImages,
                                        repeat: 'no-repeat'
                                    }
                                }
                            })
                        }
                        >
                            <SelectControl
                                label={__('Background Repeat', 'meros-carousel')}
                                value={ featuredImages?.repeat || 'no-repeat' }
                                options={[
                                    { label: 'No Repeat', value: 'no-repeat' },
                                    { label: 'Repeat', value: 'repeat-x' }
                                ]}
                                onChange={(value) => 
                                    setAttributes({
                                        carouselOptions: {
                                            ...carouselOptions,
                                            featuredImages: {
                                                ...carouselOptions.featuredImages,
                                                repeat: value
                                            }
                                        }
                                    })
                                }
                                disabled={!featuredImages?.enabled || featuredImages?.size === 'cover'}
                            />
                    </ToolsPanelItem>
                </>
            )}
        </ToolsPanel>
    );
}