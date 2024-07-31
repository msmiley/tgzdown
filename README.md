# tgzdown

the thorough npm package downloader

...every other downloader on npm I tried didn't seem to get everything 🙄

This one iterates through package-lock.json and downloads:
 - all locked packages
 - the latest for each package
 - all optionalDependencies
 - all peerDependencies

## Installation

```
npm i -g tgzdown
```

## Running

Run `tgzdown` in your project folder, all downloaded `.tgz` files will be saved in a folder named `tgzdown`
