'use strict';

const fs = require('fs');

const { resolveUnique, print, ORIG_DIR } = require('./common');

function importCmd(files, { move, parent: { dryRun } }) {
  if (!move) throw new Error('Only import with --move is currently supported');

  for (const src of files) {
    const dst = resolveUnique(src, ORIG_DIR);
    if (!dryRun) fs.renameSync(src, dst);
    print(`${src} -> ${dst}`);
  }
}
module.exports = importCmd;
