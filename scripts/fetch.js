// scripts/fetch.js
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

// Sąrašas TogetherJS Hub failų, kuriuos reikia parsisiųsti
const files = [
  {
    src: 'https://raw.githubusercontent.com/jsfiddle/togetherjs/develop/hub/server.js',
    dest: 'hub/server.cjs', // Pervadinam į .cjs
  },
  {
    src: 'https://raw.githubusercontent.com/jsfiddle/togetherjs/develop/hub/websocket-compat.js',
    dest: 'hub/websocket-compat.js',
  }
];

(async () => {
  try {
    await mkdir('hub', { recursive: true });

    for (const f of files) {
      console.log(`Downloading: ${f.src}`);
      const res = await fetch(f.src);
      if (!res.ok) throw new Error(`Download failed: ${f.src} -> ${res.status} ${res.statusText}`);
      const text = await res.text();
      await writeFile(path.join(f.dest), text);
      console.log(`Saved: ${f.dest}`);
    }

    console.log('All hub files downloaded successfully.');
  } catch (err) {
    console.error('Error downloading files:', err);
    process.exit(1);
  }
})();
