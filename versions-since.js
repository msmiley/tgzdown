#!/usr/bin/env node

const utils = require('./utils');
const fs = require('node:fs');

const OUTPUT_DIR='tgzdown';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let pkg = process.argv[2];
if (!pkg) {
  console.error('please provide package as a command-line parameter');
  process.exit(1);
}

let minVersion = process.argv[3];
if (!minVersion) {
  console.error('please provide min package version as a command-line parameter');
  process.exit(1);
}

utils.downloadVersionsSince(pkg, minVersion, OUTPUT_DIR);


