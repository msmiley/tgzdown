const { execSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

module.exports = {
  downloadSpecificVersion(pkgName, pkgVersion, outputDir) {
    console.log(`getting ${pkgName} at ${pkgVersion}`);
    execSync(`npm pack "${pkgName}@${pkgVersion}" --pack-destination ${outputDir}`, { stdio: [] });
  },
  downloadLatestVersion(pkgName, outputDir) {
    console.log(`getting ${pkgName} at latest`);
    execSync(`npm pack ${pkgName} --pack-destination ${outputDir}`, { stdio: [] });
  },
  downloadScope(scope, outputDir) {
    console.log(`downloading all package for scope: ${scope}`);
    let pkgs = JSON.parse(execSync(`npm search scope:${scope} --searchlimit=9999 --json`));
    console.log(`found ${pkgs.length} packages`);
    for (let p of pkgs) {
      this.downloadLatestVersion(p.name, outputDir);
    }
    console.log('done downloading scope packages');
  },
  downloadAllVersions(pkgName, outputDir) {
    console.log(`downloading ALL versions for ${pkgName}`);
    let versions = JSON.parse(execSync(`npm view ${pkgName} versions --json`));
    for (let v of versions) {
      let pkgInfo = JSON.parse(execSync(`npm pack ${pkgName}@${v} --dry-run --json`));
      let { filename } = pkgInfo[0];
      if (existsSync(resolve(outputDir, filename))) {
        console.log(`already have file ${filename}`);
      } else {
        console.log(`getting ${filename}`);
        execSync(`npm pack "${pkgName}@${v}" --pack-destination ${outputDir}`, { stdio: [] });
      }
    }
  },
  downloadVersionsSince(pkgName, minVersion, outputDir) {
    console.log(`downloading versions since ${minVersion} for ${pkgName}`);
    let versions = JSON.parse(execSync(`npm view ${pkgName} versions --json`));
    let minVersionIdx = versions.indexOf(minVersion);
    for (let v of versions.splice(minVersionIdx)) {
      let pkgInfo = JSON.parse(execSync(`npm pack ${pkgName}@${v} --dry-run --json`));
      let { filename } = pkgInfo[0];
      if (existsSync(resolve(outputDir, filename))) {
        console.log(`already have file ${filename}`);
      } else {
        console.log(`getting ${filename}`);
        execSync(`npm pack "${pkgName}@${v}" --pack-destination ${outputDir}`, { stdio: [] });
      }
    }
  },
  downloadLastN(pkgName, outputDir, lastN = 20) {
    console.log(`downloading last ${lastN} versions for ${pkgName}`);
    let versions = JSON.parse(execSync(`npm view ${pkgName} versions --json`));
    for (let v of versions.splice(-lastN)) {
      let pkgInfo = JSON.parse(execSync(`npm pack ${pkgName}@${v} --dry-run --json`));
      let { filename } = pkgInfo[0];
      if (existsSync(resolve(outputDir, filename))) {
        console.log(`already have file ${filename}`);
      } else {
        console.log(`getting ${filename}`);
        execSync(`npm pack "${pkgName}@${v}" --pack-destination ${outputDir}`, { stdio: [] });
      }
    }
  },
};


















// npm search reference:
// Search Syntax	          Description
// ----------------------------------------------------------------------------------------------
// scope:types	            Show/filter results that belong to the @types scope
// author:sindresorhus	    Show/filter results in which sindresorhus is the author
// maintainer:sindresorhus	Show/filter results in which sindresorhus is qualifier as a maintainer
// keywords:gulpplugin	    Show/filter results that have gulpplugin in the keywords (separate multiple keywords with commas, you may also exclude keywords e.g.
// not:deprecated	          Exclude deprecated packages from the results
// not:unstable	            Exclude packages whose version is < 1.0.0
// not:insecure           	Exclude packages that are insecure or have vulnerable dependencies (as per nsp)
// is:deprecated          	Show/filter is deprecated packages
// is:unstable	            Show/filter packages whose version is < 1.0.0
// is:insecure	            Show/filter packages that are insecure or have vulnerable dependencies (as per nsp)
// boost-exact:false	      Do not boost exact matches, defaults to true
// score-effect:14	        Set the effect that package scores have for the final search score, defaults to 15.3
// quality-weight:1	        Set the weight that quality has for the each package score, defaults to 1.95
// popularity-weight:1	    Set the weight that popularity has for the each package score, defaults to 3.3
// maintenance-weight:1	    Set the weight that the quality has for the each package score, defaults to 2.05
