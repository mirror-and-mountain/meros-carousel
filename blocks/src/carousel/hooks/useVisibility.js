import { useEffect } from '@wordpress/element';

export function useVisibility (containerRef, attr) {
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const widths = ['desktop', 'tablet', 'mobile'];

        widths.forEach(width => container.classList.remove('hide-' + width));

        widths.forEach(width => {
            if (!attr.includes(width)) {
                container.classList.add('hide-' + width);
            }
        });
    },[containerRef, attr]);
}