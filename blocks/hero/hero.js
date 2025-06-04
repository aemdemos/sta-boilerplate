export default function decorate(block) {
  const divs = [...block.querySelectorAll(':scope > div > div')];

  if (divs.length < 2) return;

  const container = document.createElement('div');
  container.append(...divs.slice(1));

  if (!divs[0].querySelector('picture')) {
    block.classList.add('no-image');
  }

  block.replaceChildren(divs[0], container);
}
