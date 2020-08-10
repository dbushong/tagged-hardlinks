'use strict';

const { dirname, join } = require('path');

const { die, findCopies, removeFile, rootDir } = require('./common');

function rmCmd(tagOrFile1, otherFilesOrDirs, { all, parent: { dryRun } }) {
  const filesOrDirs = [];
  let tag;
  if (all) {
    filesOrDirs.push(tagOrFile1);
  } else {
    if (otherFilesOrDirs.length === 0) {
      die('must supply a tag or --all AND one or more files or dirs');
    }
    tag = tagOrFile1;
  }
  filesOrDirs.push(...otherFilesOrDirs);

  const baseDir = rootDir();
  for (const item of filesOrDirs) {
    const allCopies = findCopies(item);
    const copies = all ? allCopies : allCopies.filter(x => dirname(x) === tag);
    for (const copy of copies) removeFile(join(baseDir, copy), dryRun);
  }
}
module.exports = rmCmd;
