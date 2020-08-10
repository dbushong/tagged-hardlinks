'use strict';

const { Command } = require('commander');

const pkg = require('../package.json');

const initCmd = require('./init');
const importCmd = require('./import');
const addCmd = require('./add');
const listCmd = require('./list');
const rmCmd = require('./rm');

const prog = new Command();
prog.name('tag').version(pkg.version).option('-n, --dry-run');
prog.command('init').action(initCmd);
prog.command('import <dir-or-file...>').option('-m, --move').action(importCmd);
prog.command('add <tag> <dir-or-file...>').action(addCmd);
prog.command('list <dir-or-file...>').action(listCmd);
prog.command('rm [tag] [dir-or-file...]').option('-a, --all').action(rmCmd);

prog.parse(process.argv);
