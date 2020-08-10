'use strict';

const path = require('path');
const { statSync } = require('fs');
const { execFileSync } = require('child_process');
const { rootDir, print } = require('./common');

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
    // TODO: use spawn() and stream results
    const res = execFileSync(
      'find',
      ['-samefile', path.resolve(item), '-print0'],
      {
        cwd: rootDir(),
      }
    )
      .toString()
      .split('\0');

    for (const dir of res) {
      if (/^\.\/[^.]/.test(dir)) tags.add(path.dirname(dir.slice(2)));
    }
  }

  for (const tag of [...tags].sort()) print(tag);
}
module.exports = listCmd;
