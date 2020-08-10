'use strict';

const fs = require('fs');
const path = require('path');

const { ORIG_DIR, die, print } = require('./common');

function initCmd({ dryRun }) {
  if (fs.existsSync(ORIG_DIR)) die(`${ORIG_DIR} already exists`);
  const dirPath = path.resolve(ORIG_DIR);
  if (!dryRun) fs.mkdirSync(dirPath);
  print(`created ${dirPath}`);
}
module.exports = initCmd;
