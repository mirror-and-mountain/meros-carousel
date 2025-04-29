import gsap from 'gsap';
import { MerosCarousel } from './MerosCarousel.js';

class MerosCarouselEditor extends MerosCarousel {
    updateOption(option, value) {
        this.options = {
            ...this.options,
            [option]: value
        };

        if (option === 'height' && this.slides.length > 0) {
            this.slides.forEach((slide) => {
                slide.style.height = value;
            });
        }

        if (option === 'useParallax' && this.slides.length > 0) {
            this.setUpParallax();
        }
    }
    
    destroy() {
        this.stopAutoPlay();
    
        if (this.slides) {
            gsap.killTweensOf(this.slides);
            this.slides.forEach(slide => {
                slide.style.opacity = '1';
                slide.style.transform = 'translateX(0)';
                slide.style.height = '';
                const parallaxBg = slide.querySelector('.meros-carousel-parallax-bg');
                if (parallaxBg) {
                    gsap.killTweensOf(parallaxBg);
                    parallaxBg.remove();
                }
            });
        }

        if (this.indicatorContainer) {
            this.indicatorContainer
            .querySelectorAll('*')
            .forEach((indicator) => {
                this.indicatorContainer.removeChild(indicator);
            });
        }

        this.slides = [];
        this.indicatorContainer = null;
        this.indicators = [];
        this.container = null;
    }
}

function destroyCarousel(instance = null) {
    if (!instance) return; 
    instance.destroy();
}

export function initCarousel(instance, container, slides, options) {
    if (!container) return; 
    // Destroy if instance exists
    destroyCarousel(instance);
    // Instantiate a new carousel
    return new MerosCarouselEditor(container, slides, options);
};

export function updateOption(instance, option, value) {
    // Update the Meros Carousel instance option if possible
    if (!instance) return;
    instance.updateOption(option, value);
};

export function goToNext(instance) {
    if (!instance) return;
    instance.goToNext();
}

export function goToPrev(instance) {
    if (!instance) return;
    instance.goToPrev();
}