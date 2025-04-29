import Swiper from 'swiper';
// import 'swiper/css';
// import 'swiper/css/effect-fade';
// import 'swiper/css/pagination';
import { Autoplay, A11y, EffectFade, Pagination } from 'swiper/modules';

const COMPONENT_SELECTOR = '[data-el="home-hero-slider"]';
const SLIDE_SELECTOR = '[data-el="home-hero-slider-slide"]';
const TABS_COMPONENT_SELECTOR = '[data-el="home-hero-slider-tabs"]';
const TAB_ITEM_SELECTOR = '[data-el="home-hero-slider-tab-item"]';

// Slide item selectors
const SLIDE_ITEM_BG_SELECTOR = '.home-hero_slides_item-image';
const SLIDE_ITEM_TITLE_SELECTOR = '.home-hero_slides_item-heading';
const SLIDE_ITEM_TEXT_SELECTOR = '.home-hero_slides_item-description';
const SLIDE_ITEM_BUTTON_SELECTOR = '.button_component';

class HomeHeroSlider {
  swiperEl: HTMLElement | null;
  tabsComponent: HTMLElement | null;
  tabsList: HTMLElement | null;
  tabItems: NodeListOf<HTMLElement> | null;
  slides: NodeListOf<HTMLElement> | null;
  swiper: Swiper | null;

  constructor() {
    this.swiperEl = null;
    this.tabsComponent = null;
    this.tabsList = null;
    this.tabItems = null;
    this.slides = null;
    this.swiper = null;
    this.init();
  }

  init() {
    // Selectors
    this.swiperEl = document.querySelector(COMPONENT_SELECTOR);
    this.tabsComponent = this.swiperEl?.querySelector(TABS_COMPONENT_SELECTOR) ?? null;
    this.tabsList = this.swiperEl?.querySelector(TABS_COMPONENT_SELECTOR) ?? null;
    this.tabItems = this.tabsList?.querySelectorAll(TAB_ITEM_SELECTOR) ?? null;
    this.slides = this.swiperEl?.querySelectorAll(SLIDE_SELECTOR) ?? null;

    if (!this.swiperEl || !this.tabItems || !this.slides) return;

    // Swiper init
    this.swiper = new Swiper(this.swiperEl, {
      modules: [Pagination, Autoplay, A11y, EffectFade],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 900,
      loop: false,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: this.tabsList,
        clickable: true,
        type: 'custom',
        renderCustom: (swiper: any, current: number, total: number) => {
          // Add is-active class to the correct tab
          this.tabItems?.forEach((tab, idx) => {
            tab.classList.toggle('is-active', idx === current - 1);
          });
          return '';
        },
      },
      a11y: {},
      on: {
        init: () => {
          this.animateSlide(this.swiper?.activeIndex ?? 0);
        },
        slideChangeTransitionStart: () => {
          this.animateSlide(this.swiper?.activeIndex ?? 0);
        },
      },
    });

    // Tab click events (Swiper handles clickable, but for safety)
    this.tabItems.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        this.swiper?.slideTo(idx);
      });
    });
  }

  animateSlide(index: number) {
    // Animate the current slide's elements
    const slide = this.slides?.[index];
    if (!slide) return;

    // Select elements (adjust selectors as needed)
    const bg = slide.querySelector(SLIDE_ITEM_BG_SELECTOR);
    const title = slide.querySelector(SLIDE_ITEM_TITLE_SELECTOR);
    const text = slide.querySelector(SLIDE_ITEM_TEXT_SELECTOR);
    const button = slide.querySelector(SLIDE_ITEM_BUTTON_SELECTOR);

    // Reset all animations
    this.slides?.forEach((s, i) => {
      if (i !== index) {
        gsap.set(s.querySelector(SLIDE_ITEM_BG_SELECTOR), { scale: 1, opacity: 1 });
        gsap.set(s.querySelector(SLIDE_ITEM_TITLE_SELECTOR), { y: 60, opacity: 0 });
        gsap.set(s.querySelector(SLIDE_ITEM_TEXT_SELECTOR), { y: 40, opacity: 0 });
        gsap.set(s.querySelector(SLIDE_ITEM_BUTTON_SELECTOR), { y: 40, opacity: 0 });
      }
    });

    // Animate in
    if (bg) {
      gsap.fromTo(
        bg,
        { scale: 1, opacity: 1 },
        { scale: 1.08, opacity: 1, duration: 5, ease: 'power2.out' }
      );
    }
    if (title) {
      gsap.fromTo(
        title,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );
    }
    if (text) {
      gsap.fromTo(
        text,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.4 }
      );
    }
    if (button) {
      gsap.fromTo(
        button,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.6 }
      );
    }
  }
}

// Auto-init on DOMContentLoaded
window.Webflow ||= [];
window.Webflow.push(() => {
  new HomeHeroSlider();
});
