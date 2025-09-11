const fs = require('fs');
const path = require('path');

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach((item) => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);

    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        deleteDirectory(itemPath);
      } else {
        fs.unlinkSync(itemPath);
      }
    });

    fs.rmdirSync(dirPath);
  }
}

function main() {
  try {
    // eslint-disable-next-line no-console
    console.log('Starting cleanup process...');

    // 1. Copy folders from blocks-xwalk to blocks
    const blocksXwalkPath = path.join(__dirname, '..', 'blocks-xwalk');
    const blocksPath = path.join(__dirname, '..', 'blocks');

    if (fs.existsSync(blocksXwalkPath)) {
      // eslint-disable-next-line no-console
      console.log('Copying folders from blocks-xwalk to blocks...');
      const xwalkItems = fs.readdirSync(blocksXwalkPath);

      xwalkItems.forEach((item) => {
        const sourcePath = path.join(blocksXwalkPath, item);
        const destPath = path.join(blocksPath, item);

        if (fs.statSync(sourcePath).isDirectory()) {
          copyDirectory(sourcePath, destPath);
          // eslint-disable-next-line no-console
          console.log(`Copied ${item} to blocks folder`);
        }
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('blocks-xwalk folder not found, skipping copy operation');
    }

    // 2. Delete blocks-xwalk folder
    if (fs.existsSync(blocksXwalkPath)) {
      // eslint-disable-next-line no-console
      console.log('Deleting blocks-xwalk folder...');
      deleteDirectory(blocksXwalkPath);
      // eslint-disable-next-line no-console
      console.log('blocks-xwalk folder deleted');
    }

    // 3. Delete specific files from scripts folder
    const scriptsPath = path.join(__dirname, '..', 'scripts');
    const filesToDelete = ['scripts.js', 'editor-support.js'];

    filesToDelete.forEach((file) => {
      const filePath = path.join(scriptsPath, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        // eslint-disable-next-line no-console
        console.log(`Deleted ${file}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`${file} not found, skipping deletion`);
      }
    });

    // 4. Rename xwalk files
    const filesToRename = [
      { from: 'editor-support-xwalk.js', to: 'editor-support.js' },
      { from: 'scripts-xwalk.js', to: 'scripts.js' },
    ];

    filesToRename.forEach(({ from, to }) => {
      const fromPath = path.join(scriptsPath, from);
      const toPath = path.join(scriptsPath, to);

      if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
        // eslint-disable-next-line no-console
        console.log(`Renamed ${from} to ${to}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`${from} not found, skipping rename`);
      }
    });

    // eslint-disable-next-line no-console
    console.log('Cleanup process completed successfully!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during cleanup process:', error);
    process.exit(1);
  }
}

main();
