export default function decorate(block) {
  const pictureEl = block.querySelector('picture');

  const heroContainer = document.createElement('div');
  heroContainer.className = block.className;
  Array.from(block.attributes).forEach((attr) => {
    if (!['class'].includes(attr.name)) heroContainer.setAttribute(attr.name, attr.value);
  });

  if (pictureEl) {
    heroContainer.append(pictureEl);
  } else {
    heroContainer.classList.add('hero-no-image');
  }

  const headingEl = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const paragraphEl = block.querySelectorAll('p');

  if (headingEl || paragraphEl) {
    const textDiv = document.createElement('div');

    headingEl.forEach((heading) => { textDiv.append(heading); });
    paragraphEl.forEach((paragraph) => { textDiv.append(paragraph); });

    heroContainer.append(textDiv);
  }

  block.replaceWith(heroContainer);
}
