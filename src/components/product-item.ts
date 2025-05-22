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

        if (!listInstances.length) return;

        window.IS_DEBUG_MODE && console.debug('listInstance', listInstance);

        listInstance.addHook('beforeRender', (items) => {
          const listItemElList = items.map((item) => item.element);
          this.setInitialAnimState(listItemElList);
        });

        listInstance.addHook('render', () => {
          window.Shopyflow.fetchNew();
        });

        listInstance.addHook('afterRender', (items) => {
          const listItemElList = items.map((item) => item.element);
          this.addProductItemAnimation(listItemElList);
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
        });
      },
      start: 'top bottom-=100px',
    });
  }
}
