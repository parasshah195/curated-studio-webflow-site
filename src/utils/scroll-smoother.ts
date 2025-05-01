window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  setupScrollSmoother();
  setParallaxImages();
});

function setupScrollSmoother() {
  window.smoother = ScrollSmoother.create({
    wrapper: '.page-wrapper',
    content: '.main-wrapper',
    smooth: 1,
    effects: true,
  });
}

function setParallaxImages() {
  window.smoother.effects('img', { speed: 'auto' });
}
