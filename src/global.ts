import { setCurrentYear } from '$utils/current-year';
import '$utils/scroll-smoother';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  setCurrentYear();
});
