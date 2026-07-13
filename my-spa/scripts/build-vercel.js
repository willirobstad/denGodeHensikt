// Creates Vercel's static output directory from the existing client source.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const output = path.join(root, 'public');

fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'client', 'public'), output, { recursive: true, force: true });
fs.cpSync(path.join(root, 'client', 'src'), path.join(output, 'src'), { recursive: true, force: true });
