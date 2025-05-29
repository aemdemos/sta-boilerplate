export default function decorate(block) {
    // block is the old `.hero.block` element
    const pictureEl = block.querySelector('picture');
    const headingEl = block.querySelector('h1, h2, h3, h4, h5, h6');

    // create the new container, but carry over all of block’s classes & attrs
    const newDiv = document.createElement('div');
    newDiv.className = block.className;                      // copy "hero block"
    Array.from(block.attributes).forEach(attr => {           // copy data-attrs too
        if (!['class'].includes(attr.name)) newDiv.setAttribute(attr.name, attr.value);
    });

    const textDiv = document.createElement('div');
    newDiv.append(pictureEl, textDiv);
    textDiv.append(headingEl);

    block.replaceWith(newDiv);
}
