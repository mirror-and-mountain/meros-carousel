import { __ } from '@wordpress/i18n';
import {
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalText as Text,
    FormTokenField
} from '@wordpress/components';

import styled from '@emotion/styled';

import { hasCustomValue } from '../utils/inspector.js';

export function NavigationSettings({ attributes, setAttributes, updateOption }) {

    const {
        carouselOptions
    } = attributes;

    const {
        showNav,
        showIndicators
    } = carouselOptions;

    const options = ["desktop", "tablet", "mobile"];

    const navDefaults = ["desktop"];
    const indicatorDefaults = ["desktop", "tablet", "mobile"];

    const handleReset = () => {
        setAttributes({
            carouselOptions: {
                ...carouselOptions,
                showNav: navDefaults,
                showIndicators: indicatorDefaults
            }
        });
    };

    const PanelDescription = styled.div`
        grid-column: span 2;
    `;

    return (
        <>
            <ToolsPanel label="Navigation" resetAll={ handleReset }>
                <PanelDescription>
                    Select the screen sizes where navigation arrows should appear: 
                    desktop, tablet, and/or mobile. Leave blank to hide them completely.
                </PanelDescription>
                <ToolsPanelItem
                    label="Navigation Arrows"
                    hasValue={() => 
                        hasCustomValue(showNav, navDefaults)
                    }
                    isShownByDefault={ true }
                    onDeselect={() => {
                        updateOption(
                            'carouselOptions.showNav', navDefaults
                        )
                    }}
                >
                    <FormTokenField
                        value={ Array.isArray(showNav) ? showNav : navDefaults }
                        suggestions={ options }
                        onChange={(value) => 
                            updateOption('carouselOptions.showNav', value)
                        }
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />
                </ToolsPanelItem>
            </ToolsPanel>

            <ToolsPanel label="Indicators" resetAll={ handleReset }>
                <PanelDescription>
                    Select the screen sizes where carousel indicators should appear: 
                    desktop, tablet, and/or mobile. Leave blank to hide them completely.
                </PanelDescription>
                <ToolsPanelItem
                    label="Indicators"
                    hasValue={() => 
                        hasCustomValue(showIndicators, indicatorDefaults)
                    }
                    isShownByDefault={ true }
                    onDeselect={() => {
                        updateOption(
                            'carouselOptions.showIndicators', indicatorDefaults
                        )
                    }}
                >
                    <FormTokenField
                        value={ Array.isArray(showIndicators) ? showIndicators : indicatorDefaults }
                        suggestions={ options }
                        onChange={(value) => 
                            updateOption('carouselOptions.showIndicators', value)
                        }
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                    />
                </ToolsPanelItem>
            </ToolsPanel>
        </>
    );
};