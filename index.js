#!/usr/bin/env node

const utils = require('./utils');

const OUTPUT_DIR='tgzdown';

const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');

let cwd = process.cwd();
let pkg = require(path.resolve(__dirname, 'package.json'));
let pkgLockPath = path.resolve(cwd, 'package-lock.json');

console.log(`tgzdown ${pkg.version}\n`)
console.log(`running in ${cwd}`);

// light arg processing
let args = process.argv.splice(2);
let ALL = false;
if (args.includes('-a')) {
  console.log('found "-a" switch, downloading ALL versions');
  ALL = true;
}

if (fs.existsSync(pkgLockPath)) {
  console.log('found package-lock.json');
  console.log('creating output folder');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  // parse lock file
  let lockFile = require(pkgLockPath);
  for (let [k,v] of Object.entries(lockFile.packages)) {
    if (k.length > 0) {
      let splitK = k.split('node_modules/');
      let pkgName = splitK.at(-1);
      let pkgVersion = v.version;
      if (ALL) {
        utils.downloadLastN(pkgName, OUTPUT_DIR);
      } else {
        utils.downloadSpecificVersion(pkgName, pkgVersion, OUTPUT_DIR);
        utils.downloadLatestVersion(pkgName, OUTPUT_DIR);
      }
      if (v.dependencies) {
        console.log(`=== getting dependencies for ${pkgName} ===`);
        for (let [dk, dv] of Object.entries(v.dependencies)) {
          if (ALL) {
            utils.downloadLastN(dk, OUTPUT_DIR);
          } else {
            utils.downloadSpecificVersion(dk, dv, OUTPUT_DIR);
            utils.downloadLatestVersion(dk, OUTPUT_DIR);
          }
        }
      }
      if (v.peerDependencies) {
        console.log(`=== getting peerDependencies for ${pkgName} ===`);
        for (let [dk, dv] of Object.entries(v.peerDependencies)) {
          if (ALL) {
            utils.downloadLastN(dk, OUTPUT_DIR);
          } else {
            utils.downloadSpecificVersion(dk, dv, OUTPUT_DIR);
            utils.downloadLatestVersion(dk, OUTPUT_DIR);
          }
        }
      }
      if (v.optionalDependencies) {
        console.log(`=== getting optionalDependencies for ${pkgName} ===`);
        for (let [dk, dv] of Object.entries(v.optionalDependencies)) {
          if (ALL) {
            utils.downloadLastN(dk, OUTPUT_DIR);
          } else {
            utils.downloadSpecificVersion(dk, dv, OUTPUT_DIR);
            utils.downloadLatestVersion(dk, OUTPUT_DIR);
          }
        }
      }
    }
  }
} else {
  console.error('could not find package-lock.json, tgzdown needs that file to run');
}
