#!/usr/bin/env node

'use strict';

const fs = require(`fs`);
const { Transform, Writable } = require(`stream`);
const getPkgRepo = require(`../`);
const util = require(`util`);

const yargs = require('yargs/yargs')(process.argv.slice(2))
  .usage(
    '\nPractice writing repository URL or validate the repository in a package.json file. If used without specifying a package.json file path, you will enter an interactive shell. Otherwise, the repository info in package.json is printed.'
  )
  .scriptName('get-pkg-repo')
  .command('$0')
  .command('<path> [<path> ...]')
  .example('get-pkg-repo')
  .example('get-pkg-repo package.json')
  .example('cat package.json | get-pkg-repo')
  .help().argv;

const input = yargs._;

if (process.stdin.isTTY) {
  if (input.length > 0) {
    input.forEach(path => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        try {
          const repo = getPkgRepo(JSON.parse(data));
          console.log(repo);
        } catch (e) {
          console.error(`${path}: ${e.toString()}`);
        }
      });
    });
  } else {
    process.stdin
      .pipe(new Transform({
        objectMode: true,
        transform(chunk, enc, cb) {
          try {
            const pkgData = { repository: chunk.toString() };
            const repo = getPkgRepo(pkgData);
            cb(null, util.format(repo) + '\n');
          } catch (e) {
            console.error(e.toString());
            cb();
          }
        }
      }))
      .pipe(process.stdout);
  }
} else {
  process.stdin.pipe(new Writable({
    write(chunk, enc, cb) {
      try {
        const repo = getPkgRepo(JSON.parse(chunk.toString()));
        process.stdout.write(util.format(repo) + '\n');
        cb();
      } catch (e) {
        console.error(e.toString());
        process.exit(1);
      }
    }
  }));
}
