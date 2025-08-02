// scripts/fetch.js
const { mkdir, writeFile, readFile } = require('node:fs/promises');
const path = require('node:path');

const files = [
  {
    src: 'https://raw.githubusercontent.com/jsfiddle/togetherjs/develop/hub/server.js',
    dest: 'hub/server.cjs'
  },
  {
    // Nebus naudojamas, bet parsisiunčiame – neskauda.
    src: 'https://raw.githubusercontent.com/jsfiddle/togetherjs/develop/hub/websocket-compat.js',
    dest: 'hub/websocket-compat.js'
  }
];

(async () => {
  await mkdir('hub', { recursive: true });

  for (const f of files) {
    console.log(`Downloading: ${f.src}`);
    const res = await fetch(f.src);
    if (!res.ok) throw new Error(`Download failed: ${f.src} -> ${res.status} ${res.statusText}`);
    const text = await res.text();
    await writeFile(path.join(f.dest), text);
    console.log(`Saved: ${f.dest}`);
  }

  // PATCH 1: išjungti compat (kad nenaudotų 'websocket-compat' / 'websocket-server')
  let serverCode = await readFile('hub/server.cjs', 'utf8');
  serverCode = serverCode.replace(
    /var\s+WEBSOCKET_COMPAT\s*=\s*true\s*;/,
    'var WEBSOCKET_COMPAT = false;'
  );

  // PATCH 2: pagal nutylėjimą bind’intis prie 0.0.0.0 (Render reikalavimas)
  serverCode = serverCode.replace(
    /var\s+host\s*=\s*ops\.argv\.host\s*\|\|\s*process\.env\.HUB_SERVER_HOST\s*\|\|\s*process\.env\.VCAP_APP_HOST\s*\|\|\s*process\.env\.HOST\s*\|\|\s*'127\.0\.0\.1';/,
    "var host = ops.argv.host || process.env.HUB_SERVER_HOST || process.env.VCAP_APP_HOST || process.env.HOST || '0.0.0.0';"
  );

  await writeFile('hub/server.cjs', serverCode, 'utf8');
  console.log('Patched hub/server.cjs: WEBSOCKET_COMPAT=false, default host=0.0.0.0');

  console.log('All hub files downloaded and patched successfully.');
})().catch((err) => {
  console.error('Error in fetch.js:', err);
  process.exit(1);
});
