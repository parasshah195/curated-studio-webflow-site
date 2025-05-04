export function toggleNavColor() {
  const NAV_COMPONENT_SELECTOR = '.nav_component';
  const THEME_DARK_SELECTOR = '.theme-dark';
  // const THEME_LIGHT_SELECTOR = '.theme-light';

  const NAV_LIGHT_TEXT_CLASS = 'is-light';

  const navComponent = document.querySelector(NAV_COMPONENT_SELECTOR);
  // const themeDarkElList = document.querySelectorAll(THEME_DARK_SELECTOR);
  // const themeLightElList = document.querySelectorAll(THEME_LIGHT_SELECTOR);

  if (!navComponent) return;

  // Create a ScrollTrigger for each .theme-dark section
  document.querySelectorAll(THEME_DARK_SELECTOR).forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: `top-=25px top`, // workaround to avoid top section of dark theme triggering `leaveBack`
      end: 'bottom top+=25px',
      scrub: true,
      onEnter: (self) => {
        window.IS_DEBUG_MODE && console.debug('dark', self.trigger);
        navComponent.classList.add(NAV_LIGHT_TEXT_CLASS);
      },
      onEnterBack: (self) => {
        window.IS_DEBUG_MODE && console.debug('dark (back)', self.trigger);
        navComponent.classList.add(NAV_LIGHT_TEXT_CLASS);
      },
      onLeave: (self) => {
        window.IS_DEBUG_MODE && console.debug('light', self.trigger);
        navComponent.classList.remove(NAV_LIGHT_TEXT_CLASS);
      },
      onLeaveBack: (self) => {
        window.IS_DEBUG_MODE && console.debug('light (back)', self.trigger);
        navComponent.classList.remove(NAV_LIGHT_TEXT_CLASS);
      },
      markers: window.IS_DEBUG_MODE,
    });
  });
}
