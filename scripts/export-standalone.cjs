// Embed the exported Expo web bundle for a local, double-clickable preview.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(
  /<script([^>]*?)src="([^"]+)"[^>]*><\/script>/g,
  (_, attrs, url) => '<script>' + fs.readFileSync(path.join(root, url.replace(/^\//, '')), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>'
);
fs.writeFileSync(path.join(root, 'Resonance_PC.html'), html);
console.log('Created dist/Resonance_PC.html');
