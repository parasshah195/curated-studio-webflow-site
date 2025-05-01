import { setCurrentYear } from '$utils/current-year';
import '$utils/scroll-smoother';

window.Webflow ||= [];
window.Webflow.push(() => {
  setCurrentYear();
});
