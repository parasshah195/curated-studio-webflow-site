export class ProductItem {
  PRODUCT_ITEM_SELECTOR = '[data-el="product-item"]';

  constructor() {
    this.loadShopyflowOnCMSList();
    this.addStaggerAnimation();
  }

  private addStaggerAnimation() {
    this.setInitialAnimState(this.PRODUCT_ITEM_SELECTOR);
    this.addProductItemAnimation(this.PRODUCT_ITEM_SELECTOR);
  }

  private loadShopyflowOnCMSList() {
    window.FinsweetAttributes ||= [];
    window.FinsweetAttributes.push([
      'list',
      (listInstances) => {
        const [listInstance] = listInstances;

        listInstance.addHook('beforeRender', () => {
          this.setInitialAnimState(listInstance.items);
        });

        listInstance.addHook('afterRender', () => {
          window.Shopyflow.fetchNew();
          this.addProductItemAnimation(listInstance.items);
        });
      },
    ]);
  }

  /**
   * Set initial animation state to the target
   */
  private setInitialAnimState(target: gsap.TweenTarget) {
    gsap.set(target, {
      opacity: 0,
      y: 50,
    });
  }

  private addProductItemAnimation(target: gsap.DOMTarget) {
    ScrollTrigger.batch(target, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          overwrite: 'auto',
        });
      },
      start: 'top bottom-=100px',
    });
  }
}
