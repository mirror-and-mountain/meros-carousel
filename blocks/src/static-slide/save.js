import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { style, alignSlideContent } = attributes;

	const overlayOpacity = (style?.overlay?.opacity ?? 20) / 100;

	const isDark = style?.overlay?.color === 'dark';

	const overlayColor = isDark
		? `rgba(0, 0, 0, ${overlayOpacity})`
		: `rgba(255, 255, 255, ${overlayOpacity})`;

	const styles = {
		...style,
		"--align-slide-content": alignSlideContent || 'center'
	};

	return (
		<div {...useBlockProps.save({ className: 'meros-carousel-slide', style: styles })}>
			<div className="meros-carousel-slide-content" data-layout>
				<InnerBlocks.Content />
			</div>
			<div
				className="meros-carousel-overlay"
				style={{ backgroundColor: overlayColor }}
			/>
		</div>
	);
}
