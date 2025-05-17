// Global dialog popup
import '$components/dialog';
import { toggleNavColor } from '$components/nav';
import { ProductItem } from '$components/product-item';
import '$components/slider';
import { setCurrentYear } from '$utils/current-year';
// Global scroll smoother
import '$utils/scroll-smoother';

window
  .loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', {
    name: 'swiper',
  })
  .then(() => {
    console.log('Swiper loaded');
    Swiper.use([Autoplay, A11y, Navigation, EffectFade, Pagination]);
  });

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.defaults({ ease: 'power3.out' });

  toggleNavColor();

  setCurrentYear();

  new ProductItem();
});
