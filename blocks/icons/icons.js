/**
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  [...block.children].forEach((iconitem) => {
    iconitem.classList.add('icon-item');
  });
  const iconSpans = block.querySelectorAll('p:has(span > img)');
  iconSpans.forEach((iconSpan) => {
    iconSpan.classList.add('ib-icon');
    // Find the parent icon-item and move iconSpan as its direct child
    const parentIconItem = iconSpan.closest('.icon-item');
    if (parentIconItem) {
      parentIconItem.appendChild(iconSpan);
    }
  });
  block.style.setProperty('--repeat-number', block.children.length);
}
