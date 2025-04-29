import Swiper from 'swiper';
// import 'swiper/css';
// import 'swiper/css/effect-fade';
// import 'swiper/css/pagination';
import { Autoplay, A11y, EffectFade, Pagination } from 'swiper/modules';

const COMPONENT_SELECTOR = '[data-el="home-hero-slider"]';
const SLIDE_SELECTOR = '[data-el="home-hero-slider-slide"]';
const TABS_COMPONENT_SELECTOR = '[data-el="home-hero-slider-tabs"]';
const TAB_ITEM_SELECTOR = '[data-el="home-hero-slider-tab-item"]';
const TAB_ITEM_CLASSNAME = 'home-hero_slides_tab-item';

// Slide item selectors
const SLIDE_ITEM_BG_SELECTOR = '.home-hero_slides_item-image';
const SLIDE_ITEM_TITLE_SELECTOR = '.home-hero_slides_item-heading';
const SLIDE_ITEM_TEXT_SELECTOR = '.home-hero_slides_item-description';
const SLIDE_ITEM_BUTTON_SELECTOR = '.button_component';

const AUTOPLAY_DURATION_MS = 5000;

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

    const allTabItems: string[] = [];
    this.tabItems.forEach((tab, i) => {
      allTabItems.push(tab.textContent ?? `Slide ${i + 1}`);
    });

    // Initial first slide gsap reset
    this.resetNonActiveSlides();

    // Swiper init
    this.swiper = new Swiper(this.swiperEl, {
      modules: [Autoplay, A11y, EffectFade, Pagination],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 900,
      loop: false,
      autoplay: {
        delay: AUTOPLAY_DURATION_MS,
        disableOnInteraction: false,
      },
      a11y: {
        enabled: true,
      },
      pagination: {
        el: this.tabsList,
        clickable: true,
        renderBullet: (index, className) => {
          const tabText = allTabItems[index] || `Slide ${index + 1}`;
          return `<button class="${className}">${tabText}</button>`;
        },
        bulletClass: TAB_ITEM_CLASSNAME,
        bulletElement: 'button',
        bulletActiveClass: 'is-active',
      },
      on: {
        init: () => {
          this.animateSlide(this.swiper?.activeIndex ?? 0);
        },
        slideChangeTransitionStart: () => {
          this.animateSlide(this.swiper?.activeIndex ?? 0);
        },
        slideChangeTransitionEnd: () => {
          this.resetNonActiveSlides(this.swiper?.activeIndex ?? 0);
        },
      },
    });
  }

  animateSlide(index: number) {
    // Animate the current slide's elements
    const slide = this.slides?.[index];
    if (!slide) return;

    const slideContext = gsap.context((ctx) => {
      // Only animate the incoming slide, do not reset others here
      gsap.to(SLIDE_ITEM_BG_SELECTOR, {
        scale: 1.08,
        opacity: 1,
        duration: AUTOPLAY_DURATION_MS / 1000,
        ease: 'power2.out',
      });
      gsap.to(SLIDE_ITEM_TITLE_SELECTOR, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.3,
      });
      gsap.to(SLIDE_ITEM_TEXT_SELECTOR, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        delay: 1,
      });
      gsap.to(SLIDE_ITEM_BUTTON_SELECTOR, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        delay: 1.2,
      });
    }, slide);

    return () => slideContext.revert();
  }

  resetNonActiveSlides(activeIdx: number | null = null) {
    this.slides?.forEach((s, i) => {
      if (!activeIdx || i !== activeIdx) {
        gsap.set(s.querySelector(SLIDE_ITEM_BG_SELECTOR), { scale: 1, opacity: 1 });
        gsap.set(s.querySelector(SLIDE_ITEM_TITLE_SELECTOR), { y: 60, opacity: 0 });
        gsap.set(s.querySelector(SLIDE_ITEM_TEXT_SELECTOR), { y: 40, opacity: 0 });
        gsap.set(s.querySelector(SLIDE_ITEM_BUTTON_SELECTOR), { y: 40, opacity: 0 });
      }
    });
  }
}

// Auto-init on DOMContentLoaded
window.Webflow ||= [];
window.Webflow.push(() => {
  new HomeHeroSlider();
});
