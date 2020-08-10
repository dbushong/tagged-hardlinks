'use strict';

const path = require('path');
const { statSync, linkSync, existsSync } = require('fs');

const mkdirp = require('mkdirp');

const { rootDir, validateTag, resolveUnique, print } = require('./common');

function addCmd(tag, filesOrDirs, { parent: { dryRun } }) {
  validateTag(tag);
  const tagDir = path.join(rootDir(), tag);
  if (!dryRun) mkdirp.sync(tagDir);
  for (const item of filesOrDirs) {
    const itemStat = statSync(item);
    if (itemStat.isDirectory()) {
      throw new Error('tagging dirs not yet supported');
    }
    const origDst = path.join(tagDir, item);
    // already linked
    if (existsSync(origDst) && statSync(origDst).ino === itemStat.ino) {
      continue;
    }

    const dst = resolveUnique(item, tagDir);
    // TODO: check for existing link
    if (!dryRun) linkSync(item, dst);
    print(dst);
  }
}
module.exports = addCmd;
