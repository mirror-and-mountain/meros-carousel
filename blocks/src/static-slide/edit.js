import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useRef } from '@wordpress/element';

import { SlideControls } from './components/SlideControls.js'

export default function Edit({ attributes, setAttributes }) {
    const containerRef = useRef(null);
    const { videoUrl, alignSlideContent, style } = attributes;

    /* Style object for the slide */
    const styles = {
        ...style,
        "--overlay-color": style?.overlay?.color === "dark" ? "0, 0, 0" : "255, 255, 255",
        "--overlay-opacity": (style?.overlay?.opacity ?? 20) / 100,
        "--align-slide-content": alignSlideContent || 'center'
    };

    return (
        <>
            {/* Sidebar Controls */}
            <SlideControls
                attributes={attributes}
                setAttributes={setAttributes}
            />

            {/* Block Content */}
            <div {...useBlockProps({ className: 'meros-carousel-slide', style: styles })} ref={containerRef}>
                {/* Video Background */}
                {videoUrl && (
                    <video src={videoUrl} autoPlay loop muted playsInline />
                )}

                {/* Overlay */}
                <div className='meros-carousel-overlay'></div>

                {/* Inner Content */}
                <InnerBlocks template={[
                    ['core/heading', { 
                        placeholder: 'HEADING', 
                        content: 'HEADING',
                        textColor: 'white' 
                    }],
                    ['core/paragraph', { 
                        placeholder: 'Paragraph text...', 
                        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        textColor: 'white'
                    }]]} 
                />
            </div>
        </>
    );
}
