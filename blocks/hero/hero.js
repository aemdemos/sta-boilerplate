export default function decorate(block) {
  const divs = [...block.querySelectorAll('div')];

  if (divs.length < 2) return;

  const container = document.createElement('div');
  container.append(...divs.slice(3));

  if (!divs[1].querySelector('picture')) {
    block.classList.add('no-image');
  }

  block.replaceChildren(divs[0], container);
}
