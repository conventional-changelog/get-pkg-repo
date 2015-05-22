#!/usr/bin/env node
'use strict';
var forEach = require('lodash.foreach');
var fs = require('fs');
var getPkgRepo = require('./');
var meow = require('meow');
var through = require('through2');

var cli = meow({
  help: [
    'Practice writing repoitory url or test a package.json file.',
    'If used without specifying a package.json file path, you will enter an interactive shell.',
    'Otherwise, the normalized urls in the package.json files are printed.',
    '',
    'Usage',
    '  get-pkg-repo [--fix-typo] [--warn]',
    '  get-pkg-repo [--fix-typo] [--warn] <path> [<path> ...]',
    '  cat <path> | get-pkg-repo [--fix-typo] [--warn]',
    '',
    'Examples',
    '  get-pkg-repo',
    '  get-pkg-repo package.json',
    '  cat package.json | get-pkg-repo --fix-typo'
  ].join('\n')
});

var flags = cli.flags;
var fixTypo = flags.fixTypo;
var warn = flags.warn;
var input = cli.input;

if (process.stdin.isTTY) {
  if (input[0]) {
    forEach(input, function(path) {
      var url;
      fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          console.error(err);
        }
        try {
          url = getPkgRepo(data, fixTypo, warn);
          console.log(path + ': ' + url);
        } catch (e) {
          console.error(path + ': ' + e.toString());
        }
      });
    });
  } else {
    process.stdin
      .pipe(through(function(chunk, enc, callback) {
        var url;
        var pkgData = {
          repository: chunk.toString()
        };
        try {
          url = getPkgRepo(pkgData, fixTypo, warn);
          callback(null, url + '\n');
        } catch (e) {
          console.error(e.toString());
          callback(null);
        }
      }))
      .pipe(process.stdout);
  }
} else {
  process.stdin
    .pipe(through(function(chunk, enc, callback) {
      var url;
      try {
        url = getPkgRepo(chunk.toString(), fixTypo, warn);
      } catch (e) {
        console.error(e.toString());
        process.exit(1);
      }
      callback(null, url + '\n');
    }))
    .pipe(process.stdout);
}
