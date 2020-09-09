#!/usr/bin/env node
'use strict';

const mdLinks = require('../cli.js');

const { argv } = require('yargs');
const route = process.argv[2]


mdLinks.mdLinks(route, argv)
