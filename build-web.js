const { cpSync, existsSync, mkdirSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const output = join(root, 'www');
const appFiles = [
  'index.html',
  'config.js',
  'style.css',
  'script.js',
  'navigation.js',
  'samwel-ai.js',
  'weather.html',
  'weather.css',
  'weather-app.js',
  'lens-logo.png'
];

if (existsSync(output)) {
  rmSync(output, { recursive: true, force: true });
}
mkdirSync(output, { recursive: true });

for (const file of appFiles) {
  cpSync(join(root, file), join(output, file));
}

console.log(`Built mobile web bundle in ${output}`);
