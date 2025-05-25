export class ProductItem {
  PRODUCT_ITEM_SELECTOR = '[data-el="product-item"]';

  private productItemScrollTriggers: ScrollTrigger[][] = [];

  constructor() {
    this.refetchFinsweetFilterData();
    this.loadShopyflowOnCMSList();
    this.addStaggerAnimation();
  }

  private refetchFinsweetFilterData() {
    window.addEventListener('ShopyflowReady', (event) => {
      Shopyflow.on('collectionModuleReady', ({ el, collection }) => {
        window.FinsweetAttributes ||= [];
        window.FinsweetAttributes.push([
          'list',
          (listInstances) => {
            const [listInstance] = listInstances;

            if (!listInstances.length) return;

            console.log('listInstance items', listInstance.items);

            listInstance.items.value.forEach((item) => {
              item.collectFields();
            });
          },
        ]);
      });
    });
  }

  private addStaggerAnimation() {
    // this.setInitialAnimState(this.PRODUCT_ITEM_SELECTOR);
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
          if (!items.length) return;

          const listItemElList = items.map((item) => item.element);
          // Kill previous scrolltriggers that may not have rendered
          this.productItemScrollTriggers.flat().forEach((trigger) => trigger.kill());
          this.productItemScrollTriggers = [];

          this.setInitialAnimState(listItemElList);
          this.addProductItemAnimation(listItemElList);
        });

        listInstance.addHook('pagination', (items) => {
          if (!items.length) return;

          window.Shopyflow.fetchNew().then(() => {
            items.forEach((item) => {
              item.collectFields();
            });
          });
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
    const batchTriggers = ScrollTrigger.batch(target, {
      onEnter: (batch) => {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.15,
        });
      },
      start: 'top bottom-=100px',
    });
    this.productItemScrollTriggers.push(batchTriggers);
  }
}
