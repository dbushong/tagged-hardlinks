'use strict';

const path = require('path');
const { statSync } = require('fs');
const { findCopies, print } = require('./common');

/**
 * @param {string[]} filesOrDirs
 */
function listCmd(filesOrDirs) {
  /** @type {Set<string>} */
  const tags = new Set();
  for (const item of filesOrDirs) {
    if (statSync(item).isDirectory()) {
      throw new Error('listing a directory not yet supported');
    }
    for (const dir of findCopies(item)) {
      if (dir[0] !== '.') tags.add(path.dirname(dir));
    }
  }

  for (const tag of [...tags].sort()) print(tag);
}
module.exports = listCmd;
