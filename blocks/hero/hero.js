export default function decorate(block) {
  const pictureEl = block.querySelector('picture');
  const textElements = block.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a');

  const children = [];

  if (pictureEl) {
    children.push(pictureEl);
  } else {
    block.classList.add('hero-no-image');
  }

  if (textElements.length > 0) {
    const textDiv = document.createElement('div');
    textDiv.append(...textElements);
    children.push(textDiv);
  }

  block.replaceChildren(...children);
}
