# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on [www.aem.live](https://www.aem.live/docs/) and [experienceleague.adobe.com](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/authoring), more specifically:
1. [Getting Started](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started), [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block), [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

Furthremore, we encourage you to watch the recordings of any of our previous presentations or sessions:
- [Getting started with AEM Authoring and Edge Delivery Services](https://experienceleague.adobe.com/en/docs/events/experience-manager-gems-recordings/gems2024/aem-authoring-and-edge-delivery)

## Prerequisites

- nodejs 18.3.x or newer
- AEM Cloud Service release 2024.8 or newer (>= `17465`)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

### Extra functions added
1. decorateSectionData in scripts.js
1. added alt text to icons in aem.js to pass accessibility

## Universal Editor with Edge Delivery (Crosswalk)
This repo comes with more components than the regular boilerplate, all ready for UE.

### UE component notes for adding styles
Definitions > model was defined for most components

Models > new "classes" option added to most for the block itself, not block-items.

For parity with how Edge Del. Svc. block styles are authored, I used "text" with "multi"=true for classes field to type in multiple classes.
- See table.json and video.json for examples of multiselect with child style options.
- You can also use 1 "multiselect" for classes field (with intuitive labels) to allow choosing multiple that you've pre-defined.

## paths.json
You have to add all json files you want to access publicly in mappings. Can add a new included path to experience fragments, then map it to be available via /fragments.
"mappings": [ "/content/experience-fragments/yourproject/:/fragments/" ],
"includes": [ "/content/experience-fragments/yourproject/"]

To publish icons, pdfs, or videos, you need to add cloud config per https://www.aem.live/docs/universal-editor-assets. Then add /content/dam/yourproject/ in "includes", and mapping to /icons/. BUT I could not get icons to be properly published unless they were added via the image picker onto a page an published first.