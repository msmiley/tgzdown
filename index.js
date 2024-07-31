#!/usr/bin/env node

const OUTPUT_DIR='tgzdown';

const path = require('path');
const fs = require('fs');
const { execSync } = require('node:child_process');

let cwd = process.cwd();
let pkg = require(path.resolve(__dirname, 'package.json'));
let pkgLockPath = path.resolve(cwd, 'package-lock.json');

console.log(`tgzdown ${pkg.version}\n`)
console.log(`running in ${cwd}`);

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
      console.log(`getting ${pkgName} at ${pkgVersion} plus latest`);
      execSync(`npm pack "${pkgName}@${pkgVersion}" --pack-destination ${OUTPUT_DIR}`, { stdio: [] });
      execSync(`npm pack ${pkgName} --pack-destination ${OUTPUT_DIR}`, { stdio: [] });
      if (v.dependencies) {
        console.log(` - getting dependencies for ${pkgName}`);
        for (let [dk, dv] of Object.entries(v.dependencies)) {
          console.log(`  - getting dependency for ${pkgName}: ${dk}:${dv}`);
          execSync(`npm pack "${dk}@${dv}" --pack-destination ${OUTPUT_DIR}`, { stdio: [] });
        }
      }
      if (v.peerDependencies) {
        console.log(` - getting peerDependencies for ${pkgName}`);
        for (let [dk, dv] of Object.entries(v.peerDependencies)) {
          console.log(`  - getting peerDependency for ${pkgName}: ${dk}:${dv}`);
          execSync(`npm pack "${dk}@${dv}" --pack-destination ${OUTPUT_DIR}`, { stdio: [] });
        }
      }
      if (v.optionalDependencies) {
        console.log(` - getting optionalDependencies for ${pkgName}`);
        for (let [dk, dv] of Object.entries(v.optionalDependencies)) {
          console.log(`  - getting optionalDependency for ${pkgName}: ${dk}:${dv}`);
          execSync(`npm pack "${dk}@${dv}" --pack-destination ${OUTPUT_DIR}`, { stdio: [] });
        }
      }
    }
  }
} else {
  console.error('could not find package-lock.json, tgzdown needs that file to run');
}
