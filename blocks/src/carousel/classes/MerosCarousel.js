import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { getPostInfo } from '../utils/getPostInfo.js';

export class MerosCarousel {
    constructor(container, slides, options = {}) {
        this.container = container;
        this.slides    = slides;
        this.options   = Object.assign(
            {
                animationType: 'slide',
                animationSpeed: 300,
                autoPlay: false,
                interval: 5000,
                useAsPostBanner: false,
                useParallax: false
            }, options
        );

        this.currentSlide       = 0;
        this.isAnimating        = false;
        this.indicatorContainer = this.container.querySelector('.meros-carousel-indicators');
        this.indicators         = [];
        this.bannerMap          = [];
        
        gsap.registerPlugin(ScrollTrigger);
        if (this?.slides?.length > 0) this.init();
    }

    init() {

        this.slides.forEach((slide, index) => {
            slide.style.height = this.container.style.minHeight;
            slide.style.opacity = 
                index === this.currentSlide 
                ? '1' 
                : '0';
            slide.style.transform = 
                index === this.currentSlide 
                ? 'translateX(0)' 
                : 'translateX(100%)';

            if (slide.tagName === 'LI') {

                slide.classList.add('meros-carousel-slide');
                
                if (!slide.querySelector('.meros-carousel-overlay')) {
                    const overlay = document.createElement('div');
                    overlay.classList.add('meros-carousel-overlay');
                    overlay.style.zIndex = -10;
                    if (this.container.dataset.overlay) {
                        overlay.style.backgroundColor = this.container.dataset.overlay;
                    }
                    slide.appendChild(overlay);
                }

                if (this.options.useAsPostBanner) {
                    const postInfo = getPostInfo(slide);
                    if (postInfo?.id) {
                        this.bannerMap.push({ [index]: postInfo.id });
                    }
                }
            }
            this.createIndicator(index);
        });

        if (this.slides.length > 1) {
            this.generateIndicators();
            this.setUpParallax();
            this.setupTouchEvents();
        }

        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    generateIndicators() {
        if (!this.indicatorContainer) return; 
        this.indicators.forEach((indicator, index) => {
            this.indicatorContainer.appendChild(indicator);
            if (index === this.currentSlide) {
                indicator.style.backgroundColor = 'rgba(255, 255, 255)';
            } else {
                indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }

    createIndicator(index) {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.ariaLabel = 'Go to slide ' + index;
        indicator.style.height = '0.75rem';
        indicator.style.width = '0.75rem';
        indicator.style.borderRadius = '9999px';
        indicator.style.border = 'none';
        indicator.style.cursor = 'pointer';
        indicator.addEventListener('click', () => {
            const direction = index > this.currentSlide ? 'next' : 'prev';
            this.goToSlide(index, direction);
        });

        this.indicators.push(indicator);
    }

    goToSlide(index, direction = 'next') {
        if (index === this.currentSlide || this.isAnimating || this.slides.length <= 1) return;

        this.isAnimating = true;
        const prevSlide = this.slides[this.currentSlide];
        const nextSlide = this.slides[index];

        const animationComplete = () => {
            this.isAnimating = false;
            gsap.set(prevSlide, { zIndex: 0 });
        };

        if (this.options.animationType === 'slide') {
            this.animateSlide(prevSlide, nextSlide, direction, animationComplete);
        } else {
            this.animateFade(prevSlide, nextSlide, animationComplete);
        }

        this.indicators.forEach((indicator, indIndex) => {
            if (index === indIndex) {
                indicator.style.backgroundColor = 'rgba(255, 255, 255)';
            } else {
                indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }
        });

        this.currentSlide = index;
    }

    animateSlide(prevSlide, nextSlide, direction = 'next', onComplete) {
        const offset = direction === 'prev' ? '-100%' : '100%';
        const prevOffset = direction === 'prev' ? '100%' : '-100%';
        
        gsap.set(nextSlide, { x: offset, opacity: 1 });

        gsap.to(prevSlide, { x: prevOffset, duration: this.options.animationSpeed / 1000 });
        gsap.to(nextSlide, { x: '0%', duration: this.options.animationSpeed / 1000, onComplete });
    }

    animateFade(prevSlide, nextSlide, onComplete) {
        gsap.set(nextSlide, { opacity: 0, x: '0%', zIndex: 2 });

        gsap.to(prevSlide, { autoAlpha: 0, duration: this.options.animationSpeed / 1000 });
        gsap.to(nextSlide, { autoAlpha: 1, duration: this.options.animationSpeed / 1000, onComplete });
    }

    goToNext() {
        let nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    goToPrev() {
        let prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex, 'prev');
    }

    setUpParallax() {
        const use = this.options.useParallax;

        const switchBgStyles = (source, target, remove = false) => {
            const sourceStyle = source.style;
            if (!sourceStyle || !sourceStyle.backgroundImage) return false;
            target.style.backgroundImage    = sourceStyle.backgroundImage;
            target.style.backgroundSize     = sourceStyle.backgroundSize || 'cover';
            target.style.backgroundPosition = sourceStyle.backgroundPosition || 'center';
            target.style.backgroundRepeat   = sourceStyle.backgroundRepeat || 'no-repeat';
            
            if (remove) {
                source.remove();
            } else {    
                source.style.background = '';
                source.appendChild(target);
            }

            return true;
        };

        this.slides.forEach((slide) => {
            let parallaxBg = slide.querySelector('.meros-carousel-parallax-bg');
            
            if (use) {
                if (!parallaxBg) {
                    parallaxBg = document.createElement('div');
                    parallaxBg.classList.add('meros-carousel-parallax-bg');
                    parallaxBg.style.zIndex = -20;
                }
                
                const initialised = switchBgStyles(slide, parallaxBg);
                if (initialised) {
                    gsap.fromTo(parallaxBg, { y: '0%' }, {
                        y: '-20%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: slide,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    });
                }
            }
            else {
                if (!parallaxBg) return; 
                gsap.killTweensOf(parallaxBg);
                switchBgStyles(parallaxBg, slide, true);
            }
        });
    }

    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
    
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
    
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
    
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.goToNext(); // Swipe left
                } else {
                    this.goToPrev(); // Swipe right
                }
            }
        });
    }    

    startAutoPlay() {
        if (this.slides.length <= 1) return; // Prevent auto-play on a single slide

        this.interval = setInterval(() => {
            this.goToNext();
        }, this.options.interval);
    }

    stopAutoPlay() {
        clearInterval(this.interval);
    }    
}
