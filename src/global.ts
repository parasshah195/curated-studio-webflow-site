import { setCurrentYear } from '$utils/current-year';
import '$utils/scroll-smoother';

import { toggleNavColor } from './components/nav';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.defaults({ ease: 'power3.out' });

  toggleNavColor();
  setCurrentYear();
});
