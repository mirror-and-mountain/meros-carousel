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
            <ToolsPanel label="Carousel Settings" resetAll={ handleReset }>
                <ToolsPanelItem
                    label="Carousel Type"
                    hasValue={() => 
                        hasCustomValue(carouselType, 'static')
                    }
                    isShownByDefault={ true }
                    onDeselect={() => 
                        updateOption('carouselType', 'static')
                    }
                >
                    <SelectControl
                        label="Carousel Type"
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
                    label="Animation Type"
                    hasValue={() => 
                        hasCustomValue(animationType, 'slide')
                    }
                    isShownByDefault={ true }
                    onDeselect={() =>
                        updateOption('carouselOptions.animationType', 'slide', true)
                    }
                >
                    <SelectControl 
                        label="Animation Type"
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
                    label="Animation Speed"
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
                        label="Animation Speed (ms)"
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
                    label="Auto Play"
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
                        label="Auto Play"
                        checked={ autoPlay }
                        onChange={ (value) =>
                            updateOption(
                                'carouselOptions.autoPlay', value, true
                            )
                        }
                    />
                </ToolsPanelItem>

                <ToolsPanelItem
                    label="Interval Time (ms)"
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
                        label="Interval Time (ms)"
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
                <ToolsPanel label="Single Page Application Behaviour" resetAll={ handleSPAReset }>
                    <ToolsPanelItem
                        label="Persist on navigate"
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
                            label="Persist position on navigate"
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
                            label="Go to relevant slide navigate"
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
                                label="Go to relevant slide on navigate"
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