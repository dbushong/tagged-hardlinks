'use strict';

const { Command } = require('commander');

const pkg = require('../package.json');
const initCmd = require('./init');
const importCmd = require('./import');

const prog = new Command();
prog.name('tag').version(pkg.version);

prog.command('init').action(initCmd);

prog.command('import <dir-or-file...>').action(importCmd);

prog.parse(process.argv);
