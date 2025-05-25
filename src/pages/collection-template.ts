window.Webflow ||= [];
window.Webflow.push(() => {
  filterDropdownLists();
  closeFilterDropdown();
});

function filterDropdownLists() {
  const ATTRIBUTE_NAME = 'data-filter-show';
  const collectionName = document.querySelector('[data-collection-name]')?.textContent;
  const filterVisibilityWrapperEl = document.querySelectorAll(`[${ATTRIBUTE_NAME}]`);
  if (!collectionName) {
    filterVisibilityWrapperEl.forEach((el) => el.classList.add('hide'));
    console.debug(
      'No Collection Name found. Removing all filter dropdowns with `data-filter-show` attribute'
    );
    return;
  }

  filterVisibilityWrapperEl.forEach((el) => {
    const attributeValue = el.getAttribute(ATTRIBUTE_NAME);
    const value = attributeValue?.split(',').map((item) => item.trim());
    if (!value) return;

    if (!value.includes(collectionName)) {
      el.classList.add('hide');
    }
  });
}

function closeFilterDropdown() {
  document.addEventListener('click', function (event) {
    document.querySelectorAll('form details').forEach((details) => {
      if (!details.contains(event.target)) {
        details.removeAttribute('open');
      }
    });
  });
}
