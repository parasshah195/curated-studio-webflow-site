import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { setCurrentYear } from '$utils/current-year';

window.Webflow ||= [];
window.Webflow.push(() => {
  setCurrentYear();

  gsap.registerPlugin(ScrollTrigger);
});
