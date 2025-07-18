/**
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  [...block.children].forEach((iconitem) => {
    iconitem.classList.add('icon-item');
    const icon = iconitem.querySelector('p:has(span > img)');
    const description = iconitem.querySelector('p:not(:has(span > img))');
    icon.classList.add('ib-icon');
    description.classList.add('ib-title');
  });
  block.style.setProperty('--repeat-number', block.children.length);
}
