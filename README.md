# tgzdown

the RIGOROUS npm package downloader

...every other downloader on npm I've tried just doesn't seem to get everything 🙄

tgzdown iterates through `package-lock.json` and downloads:
 - all locked version packages
 - the latest for each package
 - all optionalDependencies
 - all peerDependencies

Optionally, use the `-a` command line switch to download ALL version of EVERY package which shows up in `package-lock.json`

> Note: tgzdown checks to see if a tarball exists before downloading, so clear out the tgzdown folder to start fresh

## Installation

```
npm i -g tgzdown
```

## Running

Run `tgzdown` in your project folder, all downloaded `.tgz` files will be saved in a folder named `tgzdown`
