const COMPONENT_SELECTOR = '[data-el="hero-slider"]';
const SLIDE_SELECTOR = '[data-el="hero-slider-slide"]';
const TABS_COMPONENT_SELECTOR = '[data-el="hero-slider-tabs"]';
const TAB_ITEM_SELECTOR = '[data-el="hero-slider-tab-item"]';
const TAB_ITEM_CLASSNAME = 'hero_slides_tab-item';

// Slide item selectors
const SLIDE_ITEM_BG_SELECTOR = '.hero_bg-image-wrapper';
const SLIDE_ITEM_TITLE_SELECTOR = '.hero_heading';
const SLIDE_ITEM_TEXT_SELECTOR = '.hero_description';
const SLIDE_ITEM_BUTTON_SELECTOR = '.button_component';
const AUTOPLAY_DURATION_MS = 5000;

class HeroSlider {
  swiperEl: HTMLElement | null;
  tabsComponent: HTMLElement | null;
  tabsList: HTMLElement | null;
  tabItems: NodeListOf<HTMLElement> | [];
  slides: NodeListOf<HTMLElement> | [];
  swiper: Swiper | null;
  headingSplits: SplitText[];
  animationTimelines: gsap.core.Timeline[];

  constructor() {
    const componentEl = document.querySelector(COMPONENT_SELECTOR);

    // Selectors
    this.swiperEl = componentEl?.querySelector('.swiper') ?? null;
    this.tabsComponent = componentEl?.querySelector(TABS_COMPONENT_SELECTOR) ?? null;
    this.tabsList = componentEl?.querySelector(TABS_COMPONENT_SELECTOR) ?? null;
    this.tabItems = this.tabsList?.querySelectorAll(TAB_ITEM_SELECTOR) ?? [];
    this.slides = componentEl?.querySelectorAll(SLIDE_SELECTOR) ?? [];

    this.swiper = null;
    this.headingSplits = [];
    this.animationTimelines = [];

    gsap.registerPlugin(SplitText);

    document.fonts.ready.then(() => {
      this.initSplitText();
      this.createAnimationTimeline();
      this.initSlides();
    });
  }

  initSplitText() {
    document.querySelectorAll(SLIDE_SELECTOR).forEach((slide) => {
      const title = slide.querySelector(SLIDE_ITEM_TITLE_SELECTOR);
      if (!title) return;

      const split = SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
      });
      this.headingSplits.push(split);
    });
  }

  initSlides() {
    if (!this.swiperEl || !this.tabItems || !this.slides) return;

    const allTabItems: string[] = [];
    this.tabItems.forEach((tab, i) => {
      allTabItems.push(tab.textContent ?? `Slide ${i + 1}`);
    });
    console.debug({ allTabItems });

    // Initial first slide gsap reset
    this.resetNonActiveSlides();

    // Swiper init
    this.swiper = new Swiper(this.swiperEl, {
      // modules: [Autoplay, A11y, EffectFade, Pagination],
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

  createAnimationTimeline() {
    this.slides.forEach((slide, index) => {
      const tl = gsap.timeline({ paused: true });

      const ctx = gsap.context((ctx) => {
        // Only animate the incoming slide, do not reset others here
        tl.to(SLIDE_ITEM_BG_SELECTOR, {
          scale: 1.08,
          opacity: 1,
          duration: AUTOPLAY_DURATION_MS / 1000,
          ease: 'power2.out',
        })
          .to(
            this.headingSplits[index].lines,
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              stagger: 0.25,
              ease: 'power1.out',
            },
            '<+0.4'
          )
          .to(
            SLIDE_ITEM_TEXT_SELECTOR,
            {
              opacity: 1,
              duration: 1,
            },
            '>0.5'
          )
          .to(
            SLIDE_ITEM_BUTTON_SELECTOR,
            {
              opacity: 1,
              duration: 1,
            },
            '<'
          );
      }, slide);

      this.animationTimelines.push(tl);
      return () => ctx.revert();
    });
  }

  animateSlide(index: number) {
    // Animate the current slide's elements
    const slide = this.slides?.[index];
    if (!slide) return;

    this.animationTimelines[index].restart();
  }

  resetNonActiveSlides(activeIdx: number | null = null) {
    this.slides?.forEach((s, i) => {
      if (activeIdx === null || i !== activeIdx) {
        gsap.set(s.querySelector(SLIDE_ITEM_BG_SELECTOR), { scale: 1, opacity: 1 });
        gsap.set(this.headingSplits[i].lines, {
          yPercent: 100,
          scale: 1.1,
          opacity: 0,
        });
        gsap.set(s.querySelector(SLIDE_ITEM_TEXT_SELECTOR), { opacity: 0 });
        gsap.set(s.querySelector(SLIDE_ITEM_BUTTON_SELECTOR), { opacity: 0 });
      }
    });
  }
}

document.addEventListener('scriptLoaded:swiper', () => new HeroSlider());
