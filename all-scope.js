#!/usr/bin/env node

const utils = require('./utils');
const fs = require('node:fs');

const OUTPUT_DIR='tgzdown';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let scope = process.argv[2];
if (!scope) {
  console.error('please provide scope as a command-line parameter');
  process.exit(1);
}

utils.downloadScope(scope, OUTPUT_DIR);


