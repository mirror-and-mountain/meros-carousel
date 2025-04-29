import { useEffect } from '@wordpress/element';
import { updateOption } from '../classes/MerosCarouselEditor.js';

export function useHeightAdjust(instance, height) {
    useEffect(() => {
        if (!instance) return;
        updateOption(instance, 'height', height);
    },[instance, height])
}