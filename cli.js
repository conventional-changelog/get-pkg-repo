#!/usr/bin/env node
'use strict';
var meow = require('meow');
var getPkgRepo = require('./');
var through = require('through2');

var cli = meow({
  help: [
    'Usage',
    '  get-pkg-repo [--fix-typo] <url>',
    '',
    'Examples',
    '  get-pkg-repo bitbucket.org/a/b.git',
    '',
    '  cat package.json | get-pkg-repo --fix-typo'
  ].join('\n')
});

if (cli.input[0]) {
  var pkgData = {
    repository: cli.input[0]
  };

  console.log(getPkgRepo(pkgData, cli.flags.fixTypo));
} else {
  process.stdin
    .pipe(through(function(chunk, enc, callback) {
      var url = getPkgRepo(chunk.toString(), cli.flags.fixTypo);
      callback(null, url + '\n');
    }))
    .pipe(process.stdout);
}
