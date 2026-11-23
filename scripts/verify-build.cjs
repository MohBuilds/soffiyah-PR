const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
for (const name of ['index.html', 'style.css', 'app.js']) {
  const file = path.join(output, name);
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    throw new Error(`Missing or empty deployment file: dist/${name}`);
  }
}
execFileSync(process.execPath, ['--check', path.join(output, 'app.js')], { stdio: 'inherit' });
const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const reference = match[1].split(/[?#]/)[0];
  if (/^[a-z][a-z\d+.-]*:/i.test(reference) || reference.startsWith('//')) continue;
  if (!fs.existsSync(path.resolve(output, reference))) {
    throw new Error(`Deployment asset does not exist: ${reference}`);
  }
}
console.log('Static portfolio verified. Netlify publish directory: dist');
