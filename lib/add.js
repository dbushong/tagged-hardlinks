'use strict';

const path = require('path');
const { statSync, linkSync } = require('fs');

const mkdirp = require('mkdirp');

const { rootDir, validateTag, resolveUnique, print } = require('./common');

function addCmd(tag, filesOrDirs, { dryRun }) {
  validateTag(tag);
  const tagDir = path.join(rootDir(), tag);
  if (!dryRun) mkdirp.sync(tagDir);
  for (const item of filesOrDirs) {
    if (statSync(item).isDirectory()) {
      throw new Error('tagging dirs not yet supported');
    }
    const dst = resolveUnique(item, tagDir);
    if (!dryRun) linkSync(item, dst);
    print(dst);
  }
}
module.exports = addCmd;
