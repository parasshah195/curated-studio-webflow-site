const PRODUCT_ITEM_LIGHTBOX_SELECTOR = '[data-lightbox-el="product-item"]';

document.addEventListener('DOMContentLoaded', () => {
  addProductImageLightbox();
});

function addProductImageLightbox() {
  const lightboxLinks = document.querySelectorAll(PRODUCT_ITEM_LIGHTBOX_SELECTOR);
  lightboxLinks.forEach((lightboxLink) => {
    const imageEl = lightboxLink.querySelector<HTMLImageElement>('img');
    if (!imageEl) return;

    const imageSrc = imageEl.getAttribute('src');

    const lightboxScript = lightboxLink.querySelector<HTMLScriptElement>('script');
    if (!lightboxScript) return;
    /**
     * Webflow Lightbox JSON
     * ```
      {
          "items": [
            {
              "_id": "example_img",
              "origFileName": "image-placeholder.svg",
              "fileName": "image-placeholder.svg",
              "fileSize": 2063,
              "height": 150,
              "url": "https://d3e54v103j8qbb.cloudfront.net/img/image-placeholder.svg",
              "width": 150,
              "type": "image"
            }
          ],
          "group": ""
      }
     * ```
     */

    lightboxScript.textContent = JSON.stringify({
      items: [
        {
          _id: Math.random().toString(),
          url: imageSrc,
          type: 'image',
        },
      ],
      group: '',
    });
  });
}
