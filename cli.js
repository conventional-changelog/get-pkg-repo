#!/usr/bin/env node
'use strict';
var forEach = require('lodash.foreach');
var meow = require('meow');
var getPkgRepo = require('./');
var through = require('through2');

var cli = meow({
  help: [
    'Usage',
    '  get-pkg-repo [--fix-typo] [--warn] [<url>...]',
    '',
    'Examples',
    '  get-pkg-repo',
    '  get-pkg-repo bitbucket.org/a/b.git',
    '  cat package.json | get-pkg-repo --fix-typo'
  ].join('\n')
});

var flags = cli.flags;

if (process.stdin.isTTY) {
  if (cli.input[0]) {
    forEach(cli.input, function(repo) {
      var url;
      var pkgData = {
        repository: repo
      };
      try {
        url = getPkgRepo(pkgData, flags.fixTypo, flags.warn);
        console.log(url);
      } catch (e) {
        console.error(e.toString());
      }
    });
  } else {
    process.stdin
      .pipe(through(function(chunk, enc, callback) {
        var url;
        var pkgData = {
          repository: chunk.toString()
        };
        try {
          url = getPkgRepo(pkgData, flags.fixTypo, flags.warn);
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
        url = getPkgRepo(chunk.toString(), flags.fixTypo, flags.warn);
      } catch (e) {
        console.error(e.toString());
        process.exit(1);
      }
      callback(null, url + '\n');
    }))
    .pipe(process.stdout);
}
