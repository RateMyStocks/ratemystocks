import 'zone.js/dist/zone-node';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import './../backend/src/main';

export * from './src/main.server';

const domino = require('domino');
const fs = require('fs');
const path = require('path');
import { join } from 'path';

// Use the browser index.html as template for the mock window
const template = fs.readFileSync(path.join(join(process.cwd(), 'dist/frontend/browser'), 'index.html')).toString();

// Shim for the global window and document objects.
const window = domino.createWindow(template);
global['window'] = window;
global['document'] = window.document;
