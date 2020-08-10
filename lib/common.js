'use strict';

const path = require('path');
const fs = require('fs');

exports.ORIG_DIR = '.taghl-orig';

function die(msg) {
  // eslint-disable-next-line no-console
  console.error(msg);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
exports.die = die;

// eslint-disable-next-line no-console
exports.print = console.log;

function resolveUnique(src, destDir) {
  const destBase = path.basename(src);
  let suffix = 0;
  let dst;
  do {
    dst = path.join(destDir, destBase + (suffix++ ? `${suffix}` : ''));
  } while (!fs.existsSync(dst));
  return dst;
}
exports.resolveUnique = resolveUnique;
