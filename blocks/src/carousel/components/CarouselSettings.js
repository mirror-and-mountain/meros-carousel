import { __ } from '@wordpress/i18n';
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    SelectControl, 
    ToggleControl, 
    RangeControl
} from '@wordpress/components';

import { hasCustomValue } from '../utils/inspector.js';

export const CarouselSettings = ({ attributes, setAttributes, updateOption }) => {

    const {
        carouselType,
        carouselOptions,
        spaOptions
    } = attributes;

    const {
        animationType,
        animationSpeed,
        autoPlay,
        interval
    } = carouselOptions;

    const {
        persist,
        matchPost
    } = spaOptions;

    const dynamicPageEnabled = window.MerosDynamicPage ?? false;
    
    const handleReset = () => {
        setAttributes({
            carouselType: 'static',
            useAsPostBanner: 'false',
            carouselOptions: {
                ...carouselOptions,
                animationType: 'slide',
                animationSpeed: 300,
                autoPlay: false,
                interval: 3000
            }
        });
    };

    const handleSPAReset = () => {
        setAttributes({
            spaOptions: {
                persist: true,
                matchPost: true

            }
        });
    };

    return (
        <>
            <ToolsPanel label={__('Carousel Settings', 'meros-carousel' )} resetAll={ handleReset }>
                <ToolsPanelItem
                    label={__('Carousel Type', 'meros-carousel' )}
                    hasValue={() => 
                        hasCustomValue(carouselType, 'static')
                    }
                    isShownByDefault={ true }
                    onDeselect={() => 
                        updateOption('carouselType', 'static')
                    }
                >
                    <SelectControl
                        label={__('Carousel Type', 'meros-carousel' )}
                        value={ carouselType || 'static' }
                        options={[
                            {label: 'Static Banner', value: 'static'},
                            {label: 'Dynamic Banner', value: 'dynamic'}
                        ]}
                        onChange={(value) => {
                            updateOption('carouselType', value);
                            if (value === 'static') {
                                setAttributes({
                                    useAsPostBanner: false
                                });
                            }
                        }}
                    />
                </ToolsPanelItem>

                <ToolsPanelItem
                    label={__('Animation Type', 'meros-carousel' )}
                    hasValue={() => 
                        hasCustomValue(animationType, 'slide')
                    }
                    isShownByDefault={ true }
                    onDeselect={() =>
                        updateOption('carouselOptions.animationType', 'slide', true)
                    }
                >
                    <SelectControl 
                        label={__('Animation Type', 'meros-carousel' )}
                        value={ animationType || 'slide' }
                        options={[
                            {label: 'Slide', value: 'slide'},
                            {label: 'Fade', value: 'fade'}
                        ]}
                        onChange={(value) => 
                            updateOption(
                                'carouselOptions.animationType', value, true
                            )
                        }
                    />
                </ToolsPanelItem>

                <ToolsPanelItem
                    label={__('Animation Speed', 'meros-carousel' )}
                    hasValue={() => 
                        hasCustomValue(animationSpeed, 500)
                    }
                    isShownByDefault={ true }
                    onDeselect={() =>
                        updateOption(
                            'carouselOptions.animationSpeed', 500, true
                        )
                    }
                >
                    <RangeControl 
                        label={__('Animation Speed (ms)', 'meros-carousel' )}
                        value={ animationSpeed || 500 }
                        onChange={(value) => 
                            updateOption(
                                'carouselOptions.animationSpeed', value, true
                            )
                        }
                        min={ 100 }
                        max={ 5000 }
                    />
                </ToolsPanelItem>

                <ToolsPanelItem
                    label={__('Auto Play', 'meros-carousel' )}
                    hasValue={() => 
                        hasCustomValue(autoPlay, false)
                    }
                    isShownByDefault={ true }
                    onDeselect={() =>
                        updateOption(
                            'carouselOptions.autoPlay', false, true
                        )
                    }
                >
                    <ToggleControl 
                        label={__('Auto Play', 'meros-carousel' )}
                        checked={ autoPlay }
                        onChange={ (value) =>
                            updateOption(
                                'carouselOptions.autoPlay', value, true
                            )
                        }
                    />
                </ToolsPanelItem>

                <ToolsPanelItem
                    label={__('Interval Time (ms)', 'meros-carousel' )}
                    hasValue={() => 
                        hasCustomValue(interval, 5000)
                    }
                    isShownByDefault={ true }
                    onDeselect={() => 
                        updateOption(
                            'carouselOptions.interval', 5000, true
                        )
                    }
                >
                    <RangeControl 
                        label={__('Interval Time (ms)', 'meros-carousel' )}
                        value={ interval || 5000 }
                        onChange={ (value) => 
                            updateOption(
                                'carouselOptions.interval', value, true
                            )
                        }
                        min={ 1000 }
                        max={ 10000 }
                        disabled={!(autoPlay)}
                    />
                </ToolsPanelItem>
            </ToolsPanel>

            { dynamicPageEnabled && (
                <ToolsPanel label={__('Single Page Application Behaviour', 'meros-carousel' )} resetAll={ handleSPAReset }>
                    <ToolsPanelItem
                        label={__('Persist on navigate', 'meros-carousel' )}
                        hasValue={() => 
                            hasCustomValue(persist, true)
                        }
                        isShownByDefault={ true }
                        onDeselect={() =>
                            setAttributes({
                                spaOptions: {
                                    ...spaOptions,
                                    persist: true
                                }
                            })
                        }
                    >
                        <ToggleControl 
                            label={__('Persist position on navigate', 'meros-carousel' )}
                            checked={ persist }
                            onChange={ (value) =>
                                setAttributes({
                                    spaOptions: {
                                        ...spaOptions,
                                        persist: value
                                    }
                                })
                            }
                        />
                    </ToolsPanelItem>

                    { carouselType === 'dynamic' && (
                         <ToolsPanelItem
                            label={__('Go to relevant slide on navigate', 'meros-carousel' )}
                            hasValue={() => 
                                hasCustomValue(matchPost, true)
                            }
                            isShownByDefault={ true }
                            onDeselect={() =>
                                setAttributes({
                                    spaOptions: {
                                        ...spaOptions,
                                        matchPost: true
                                    }
                                })
                            }
                        >
                            <ToggleControl 
                                label={__('Go to relevant slide on navigate', 'meros-carousel' )}
                                checked={ matchPost }
                                onChange={ (value) =>
                                    setAttributes({
                                        spaOptions: {
                                            ...spaOptions,
                                            matchPost: value
                                        }
                                    })
                                }
                            />
                        </ToolsPanelItem>
                    )}
                </ToolsPanel>
            )}
        </>
    );
};