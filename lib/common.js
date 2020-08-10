'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const ORIG_DIR = '.taghl-orig';
exports.ORIG_DIR = ORIG_DIR;

function die(msg) {
  // eslint-disable-next-line no-console
  console.error(msg);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
exports.die = die;

const print = console.log; // eslint-disable-line no-console
exports.print = console.log; // eslint-disable-line no-console

/**
 * @param {string} src
 * @param {string} destDir
 */
function resolveUnique(src, destDir) {
  const m = path
    .basename(src)
    .match(/(?<destBase>.+?)(?<destExt>(?:\.[^.]+)?)$/);
  const { destBase, destExt } = m.groups;
  let suffix = 0;
  let dst;
  do {
    dst = path.join(
      destDir,
      `${destBase}${suffix++ ? `${suffix + 1}` : ''}${destExt}`
    );
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
}
exports.validateTag = validateTag;

/**
 * @param {string} file
 */
function findCopies(file) {
  // TODO: implement internally
  return execFileSync('find', ['-samefile', path.resolve(file), '-print0'], {
    cwd: rootDir(),
  })
    .toString()
    .split('\0')
    .slice(0, -1)
    .map(x => x.substr(2));
}
exports.findCopies = findCopies;

/**
 * removes a file, cleaning up directories above it
 *
 * @param {string} file
 * @param {boolean} [dryRun]
 */
function removeFile(file, dryRun = false) {
  if (dryRun) print(`rm ${file}`);
  else fs.unlinkSync(file);

  let dir = file;
  let n = dryRun ? 1 : 0;
  while (dir !== '.') {
    dir = path.dirname(dir);
    if (path.basename(dir) === ORIG_DIR) break;
    if (fs.readdirSync(dir).length > n) break;
    n = 0;
    if (dryRun) print(`rmdir ${dir}`);
    else fs.rmdirSync(dir);
  }
}
exports.removeFile = removeFile;
