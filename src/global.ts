// Global dialog popup
import '$components/dialog';
import { toggleNavColor } from '$components/nav';
import { ProductItem } from '$components/product-item';
import '$components/slider';
import { setCurrentYear } from '$utils/current-year';
// Global scroll smoother
import '$utils/scroll-smoother';

window.loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', {
  name: 'swiper',
});

loadFinsweetAttributesScript();

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.defaults({ ease: 'power3.out' });

  toggleNavColor();

  setCurrentYear();

  new ProductItem();
});

/**
 * Load the Finsweet Attributes script with the `fs-list` attribute.
 * This is a workaround to load the script after the Shopyflow data is loaded, to allow filtering to work
 */
function loadFinsweetAttributesScript() {
  window.loadScript(
    'https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js',
    {
      name: 'finsweet-attributes',
    },
    {
      type: 'module',
      'fs-list': '',
    }
  );
}
