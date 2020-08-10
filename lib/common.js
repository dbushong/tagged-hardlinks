'use strict';

const path = require('path');
const fs = require('fs');

const ORIG_DIR = '.taghl-orig';
exports.ORIG_DIR = ORIG_DIR;

function die(msg) {
  // eslint-disable-next-line no-console
  console.error(msg);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
exports.die = die;

// eslint-disable-next-line no-console
exports.print = console.log;

/**
 * @param {string} src
 * @param {string} destDir
 */
function resolveUnique(src, destDir) {
  const destBase = path.basename(src);
  let suffix = 0;
  let dst;
  do {
    dst = path.join(destDir, destBase + (suffix++ ? `${suffix}` : ''));
  } while (fs.existsSync(dst));
  return dst;
}
exports.resolveUnique = resolveUnique;

function rootDir() {
  for (let dir = process.cwd(); dir !== '/'; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, ORIG_DIR))) return dir;
  }
  throw new Error(`couldn't find root dir with ${ORIG_DIR}; not in tag tree?`);
}
exports.rootDir = rootDir;

/**
 * @param {string} tag
 */
function validateTag(tag) {
  if (tag.length === 0) throw new Error(`tags cannot be empty: ${tag}`);
  const parts = tag.split('/');
  if (parts.some(p => /^\./.test(p))) {
    throw new Error(`tag parts cannot start with .: ${tag}`);
  }
  if (parts.some(p => p.includes('/'))) {
    throw new Error(`tags cannot contain /: ${tag}`);
  }
}
exports.validateTag = validateTag;
