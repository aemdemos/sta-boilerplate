import { showSlide } from '../blocks/carousel/carousel.js';
import {
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  loadBlock,
  loadScript,
  loadSections,
} from './aem.js';
import { decorateRichtext } from './editor-support-rte.js';
import { decorateMain, moveAttributes } from './scripts-xwalk.js';

function preserveSectionAttributes(oldSection, newSection) {
  moveAttributes(oldSection, newSection, [
    'id',
    'role',
    'tabindex',
    'aria-labelledby',
    'hidden',
  ]);
}

function updateLabels(main) {
  setTimeout(() => {
    const tabPanels = main.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach((tabPanel) => {
      const label = tabPanel.dataset.tabLabel;
      const suffix = ` (${label})`;
      if (!tabPanel.dataset.aueLabel.endsWith(suffix)) {
        tabPanel.dataset.aueLabel += suffix;
      }
      const tabId = tabPanel.getAttribute('aria-labelledby');
      const tab = main.querySelector(`#${tabId}`);
      if (tab) {
        tab.textContent = label;
      }
    });
  }, 100);
}

/**
 *
 * @param {Element} block
 * @param {HTMLElement} block
 * Use this function to trigger a mutation for the UI editor overlay when you
 * have a scrollable block
 */
function createMutation(block) {
  block.setAttribute('xwalk-scroll-mutation', 'true');
  block.querySelector('.carousel-slides').onscrollend = () => {
    block.removeAttribute('xwalk-scroll-mutation');
  };
}

function getState(block) {
  if (block.matches('.accordion')) {
    return [...block.querySelectorAll('details[open]')].map(
      (details) => details.dataset.aueResource,
    );
  }
  if (block.matches('.carousel')) {
    return block.dataset.activeSlide;
  }
  return null;
}

function setState(block, state) {
  if (block.matches('.accordion')) {
    block.querySelectorAll('details').forEach((details) => {
      details.open = state.includes(details.dataset.aueResource);
    });
  }
  if (block.matches('.carousel')) {
    block.style.display = null;
    createMutation(block);
    showSlide(block, state);
  }
}

async function applyChanges(event) {
  // redecorate default content and blocks on patches (in the properties rail)
  const { detail } = event;

  const resource = detail?.request?.target?.resource // update, patch components
    || detail?.request?.target?.container?.resource // update, patch, add to sections
    || detail?.request?.to?.container?.resource; // move in sections
  if (!resource) return false;
  const updates = detail?.response?.updates;
  if (!updates.length) return false;
  const { content } = updates[0];
  if (!content) return false;

  // load dompurify
  await loadScript(`${window.hlx.codeBasePath}/scripts/dompurify.min.js`);

  const sanitizedContent = window.DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
  const parsedUpdate = new DOMParser().parseFromString(sanitizedContent, 'text/html');
  const element = document.querySelector(`[data-aue-resource="${resource}"]`);

  if (element) {
    if (element.matches('main')) {
      const newMain = parsedUpdate.querySelector(`[data-aue-resource="${resource}"]`);
      newMain.style.display = 'none';
      element.insertAdjacentElement('afterend', newMain);
      decorateMain(newMain);
      decorateRichtext(newMain);
      await loadSections(newMain);
      element.remove();
      newMain.style.display = null;
      // eslint-disable-next-line no-use-before-define
      attachEventListners(newMain);
      return true;
    }

    const block = element.parentElement?.closest('.block[data-aue-resource]') || element?.closest('.block[data-aue-resource]');
    if (block) {
      const blockResource = block.getAttribute('data-aue-resource');
      const newBlock = parsedUpdate.querySelector(`[data-aue-resource="${blockResource}"]`);
      if (newBlock) {
        const state = getState(block);
        newBlock.style.display = 'none';
        block.insertAdjacentElement('afterend', newBlock);
        decorateButtons(newBlock);
        decorateIcons(newBlock);
        decorateBlock(newBlock);
        decorateRichtext(newBlock);
        await loadBlock(newBlock);
        block.remove();
        setState(newBlock, state);
        newBlock.style.display = null;
        return true;
      }
    } else {
      // sections and default content, may be multiple in the case of richtext
      const newElements = parsedUpdate.querySelectorAll(`[data-aue-resource="${resource}"],[data-richtext-resource="${resource}"]`);
      if (newElements.length) {
        const { parentElement } = element;
        if (element.matches('.section')) {
          const [newSection] = newElements;
          newSection.style.display = 'none';
          element.insertAdjacentElement('afterend', newSection);
          preserveSectionAttributes(element, newSection);
          decorateButtons(newSection);
          decorateIcons(newSection);
          decorateRichtext(newSection);
          decorateSections(parentElement);
          decorateBlocks(parentElement);
          await loadSections(parentElement);
          element.remove();
          newSection.style.display = null;
        } else {
          element.replaceWith(...newElements);
          decorateButtons(parentElement);
          decorateIcons(parentElement);
          decorateRichtext(parentElement);
        }
        return true;
      }
    }
  }

  return false;
}

function handleSelection(event) {
  const { detail, target } = event;
  if (!detail.selected) return;

  const tabPanel = target.closest('[role="tabpanel"]');
  if (tabPanel) {
    // select the tab item that controls this tab panel
    const tabItem = document.querySelector(`[aria-controls="${tabPanel.id}"]`);
    if (tabItem) tabItem.click();
  }
}

function attachEventListners(main) {
  [
    'aue:content-patch',
    'aue:content-update',
    'aue:content-add',
    'aue:content-move',
    'aue:content-remove',
    'aue:content-copy',
  ].forEach((eventType) => main?.addEventListener(eventType, async (event) => {
    event.stopPropagation();
    const applied = await applyChanges(event);
    if (applied) {
      updateLabels(document.querySelector('main'));
    } else {
      window.location.reload();
    }
  }));

  main.addEventListener('aue:ui-select', handleSelection);
}

const m = document.querySelector('main');
attachEventListners(m);
updateLabels(m);
