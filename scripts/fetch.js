// scripts/fetch.js
import { writeFile } from 'node:fs/promises';
import fetch from 'node-fetch';

const files = [
  {
    src: 'https://raw.githubusercontent.com/jsfiddle/togetherjs/develop/hub/server.js',
    dest: 'hub/server.cjs',       // jei nori .cjs – ok
  },
  {
    src: 'https://raw.githubusercontent.com/jsfiddle/togetherjs/develop/hub/websocket-compat.js',
    dest: 'hub/websocket-compat.js',
  },
];

for (const f of files) {
  const res = await fetch(f.src);
  if (!res.ok) throw new Error(`Download failed: ${f.src} -> ${res.status}`);
  await writeFile(f.dest, await res.text());
  console.log(`Saved ${f.dest}`);
}

