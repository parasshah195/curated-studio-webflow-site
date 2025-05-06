// Global dialog popup
import '$components/dialog';
import { setCurrentYear } from '$utils/current-year';
// Global scroll smoother
import '$utils/scroll-smoother';

import { toggleNavColor } from './components/nav';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.defaults({ ease: 'power3.out' });

  toggleNavColor();

  setCurrentYear();
});
