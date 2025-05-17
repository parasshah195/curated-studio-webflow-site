const AUTOPLAY_DURATION_MS = 5000;

class HeroSlider {
  COMPONENT_SELECTOR = '[data-el="hero-slider"]';
  SLIDE_SELECTOR = '[data-el="hero-slider-slide"]';
  TABS_COMPONENT_SELECTOR = '[data-el="hero-slider-tabs"]';
  TAB_ITEM_SELECTOR = '[data-el="hero-slider-tab-item"]';
  TAB_ITEM_CLASSNAME = 'hero_slides_tab-item';

  // Slide item selectors
  SLIDE_ITEM_BG_SELECTOR = '.hero_slides_item-image';
  SLIDE_ITEM_TITLE_SELECTOR = '.hero_slides_item-heading';
  SLIDE_ITEM_TEXT_SELECTOR = '.hero_slides_item-description';
  SLIDE_ITEM_BUTTON_SELECTOR = '.button_component';

  swiperEl: HTMLElement | null;
  tabsComponent: HTMLElement | null;
  tabsList: HTMLElement | null;
  tabItems: NodeListOf<HTMLElement> | [];
  slides: NodeListOf<HTMLElement> | [];
  swiper: Swiper | null;
  headingSplits: SplitText[];

  constructor() {
    // Selectors
    this.swiperEl = document.querySelector(this.COMPONENT_SELECTOR);
    this.tabsComponent = this.swiperEl?.querySelector(this.TABS_COMPONENT_SELECTOR) ?? null;
    this.tabsList = this.swiperEl?.querySelector(this.TABS_COMPONENT_SELECTOR) ?? null;
    this.tabItems = this.tabsList?.querySelectorAll(this.TAB_ITEM_SELECTOR) ?? [];
    this.slides = this.swiperEl?.querySelectorAll(this.SLIDE_SELECTOR) ?? [];

    this.swiper = null;
    this.headingSplits = [];

    gsap.registerPlugin(SplitText);

    document.fonts.ready.then(() => {
      this.initSplitText();
      this.initSlides();
    });
  }

  initSplitText() {
    document.querySelectorAll(this.SLIDE_SELECTOR).forEach((slide) => {
      const title = slide.querySelector(this.SLIDE_ITEM_TITLE_SELECTOR);
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
        bulletClass: this.TAB_ITEM_CLASSNAME,
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

    const tl = gsap.timeline();

    const ctx = gsap.context((ctx) => {
      // Only animate the incoming slide, do not reset others here
      tl.to(this.SLIDE_ITEM_BG_SELECTOR, {
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
          this.SLIDE_ITEM_TEXT_SELECTOR,
          {
            opacity: 1,
            duration: 1,
          },
          '>0.5'
        )
        .to(
          this.SLIDE_ITEM_BUTTON_SELECTOR,
          {
            opacity: 1,
            duration: 1,
          },
          '<'
        );
    }, slide);

    return () => ctx.revert();
  }

  resetNonActiveSlides(activeIdx: number | null = null) {
    this.slides?.forEach((s, i) => {
      if (!activeIdx || i !== activeIdx) {
        gsap.set(s.querySelector(this.SLIDE_ITEM_BG_SELECTOR), { scale: 1, opacity: 1 });
        gsap.set(this.headingSplits[i].lines, {
          yPercent: 100,
          scale: 1.1,
          opacity: 0,
        });
        gsap.set(s.querySelector(this.SLIDE_ITEM_TEXT_SELECTOR), { opacity: 0 });
        gsap.set(s.querySelector(this.SLIDE_ITEM_BUTTON_SELECTOR), { opacity: 0 });
      }
    });
  }
}

window.addEventListener('scriptLoaded:swiper', () => new HeroSlider());
