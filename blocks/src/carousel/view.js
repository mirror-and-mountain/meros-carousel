import { gsap } from 'gsap';
import { MerosCarousel } from './classes/MerosCarousel.js';

let isLivewireNavigate      = false;
let currentCarouselInstance = null;

function initMerosCarousel() {
	const containers = document.querySelectorAll('.meros-carousel');

	containers.forEach(container => {
		// Prevent double initialization
		if (container.dataset.initialized === 'true') return;
		container.dataset.initialized = 'true';

		if (!isLivewireNavigate) {
			injectSpinnerOverCarousel(container);
		}

		const options = JSON.parse(container.dataset.options || '{}');
		if (!options) return;

		const slides = Array.from(new Set([
			...container.querySelectorAll('li'),
			...container.querySelectorAll('.meros-carousel-slide')
		]));
		if (!slides?.length) return;

		const instance = new MerosCarousel(container, slides, options);
		if (!instance) return;
		currentCarouselInstance = instance;

		const indicatorOptions = JSON.parse(container.dataset.indicators || '{}');
		const navOptions = JSON.parse(container.dataset.nav || '{}');

		initNav(container, instance, 'navigation', navOptions);
		initNav(container, instance, 'indicators', indicatorOptions);

		const alignSlideContent = container.dataset.align || 'center';
		container.style.setProperty('--align-slide-content', alignSlideContent);

		setTimeout(() => {
			const spinner = document.querySelector('.meros-carousel-loading-indicator');
			if (spinner) {
				gsap.to(spinner, { autoAlpha: 0, duration: 0.1, onComplete: () => spinner.remove() });
			}
			container.style.visibility = 'visible';
		}, isLivewireNavigate ? 0 : 500);
	});
}

function initNav(container, instance, type, settings) {
	const navContainer = container.querySelector('.meros-carousel-' + type);
	if (!navContainer || !settings || settings?.main === false) return;

	const widths = ['desktop', 'tablet', 'mobile'];
	widths.forEach((width) => {
		if (Array.isArray(settings) && !settings.includes(width)) {
			navContainer.classList.add('hide-' + width);
		}
	});

	if (type !== 'navigation') return;

	const prevButton = navContainer.querySelector('.meros-carousel-prev');
	const nextButton = navContainer.querySelector('.meros-carousel-next');
	if (!prevButton || !nextButton) return;

	prevButton.addEventListener('click', () => instance.goToPrev());
	nextButton.addEventListener('click', () => instance.goToNext());
}

function injectSpinnerOverCarousel(container) {
	const existing = document.querySelector('.meros-carousel-loading-indicator');
	if (existing) return;

	const rect = container.getBoundingClientRect();

	const spinner = document.createElement('div');
	spinner.className = 'meros-carousel-loading-indicator';
	Object.assign(spinner.style, {
		position: 'fixed',
		top: `${rect.top + rect.height / 2}px`,
		left: `${rect.left + rect.width / 2}px`,
		transform: 'translate(-50%, -50%)',
		zIndex: 10000,
	});

	document.body.appendChild(spinner);
}

function navigateCarouselToPost(postId, carouselInstance) {
	if (!carouselInstance?.bannerMap || !postId) return;

	for (const obj of carouselInstance.bannerMap) {
		const [slideKey, mappedPostId] = Object.entries(obj)[0];
		if (String(mappedPostId) !== String(postId)) continue;

		const slideIndex = Number(slideKey);
		if (slideIndex === carouselInstance.currentSlide) return;

		carouselInstance.goToSlide(slideIndex);
		break;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	isLivewireNavigate = false;
	initMerosCarousel();
});

document.addEventListener('livewire:navigated', () => {
	isLivewireNavigate = true;
	initMerosCarousel();
	navigateCarouselToPost(window.merosWiredPostId ?? null, currentCarouselInstance);
});
