'use strict';

const { Command } = require('commander');

const pkg = require('../package.json');

const initCmd = require('./init');
const importCmd = require('./import');
const addCmd = require('./add');
const listCmd = require('./list');

const prog = new Command();
prog.name('tag').version(pkg.version).option('--dry-run, -n');
prog.command('init').action(initCmd);
prog.command('import <dir-or-file...>').option('-m, --move').action(importCmd);
prog.command('add <tag> <dir-or-file...>').action(addCmd);
prog.command('list <dir-or-file...>').action(listCmd);

prog.parse(process.argv);
