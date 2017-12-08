#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Get normalized repository URL from package json data


## Synopsis

People write the repository URL in their `package.json` file using different formats, and sometimes there is even a typo.

This module extracts the code from the [npm package manager](https://github.com/npm/npm/blob/master/lib/repo.js), and uses [normalize-package-data](https://github.com/npm/normalize-package-data), [hosted-git-info](https://github.com/npm/hosted-git-info) and [parse-github-repo-url](https://github.com/repo-utils/parse-github-repo-url), to parse the provided package input and return a repository URL object.

If you are interested, please check those other packages for more details.

Common misspelling of the [repository](https://docs.npmjs.com/files/package.json#repository) field are also corrected (Please see the source code for available corrections.).

**This module mutates/normalizes the input using `normalize-package-data`.**

**If you find the returned repository URL object is not correct, it's likely an issue with one of the libraries listed earlier. Please try to triage the problem before you open an issue here.**

## Install

```sh
$ npm install --save get-pkg-repo
```


## Usage

```js
var fs = require('fs');
var getPkgRepo = require('get-pkg-repo');

fs.readFile('package.json', function(err, pkgData) {
  if (err) {
    ...
  }

  // Contents of `pkgData` are mutated/normalized by `normalize-package-data`.
  var repo = getPkgRepo(pkgData);
  console.log(repo)
  /*=>
  { type: 'github',
    protocols: [ 'git', 'http', 'git+ssh', 'git+https', 'ssh', 'https' ],
    domain: 'github.com',
    treepath: 'tree',
    filetemplate: 'https://{auth@}raw.githubusercontent.com/{user}/{project}/{committish}/{path}',
    bugstemplate: 'https://{domain}/{user}/{project}/issues',
    gittemplate: 'git://{auth@}{domain}/{user}/{project}.git{#committish}',
    sshtemplate: 'git@{domain}:{user}/{project}.git{#committish}',
    sshurltemplate: 'git+ssh://git@{domain}/{user}/{project}.git{#committish}',
    browsetemplate: 'https://{domain}/{user}/{project}{/tree/committish}',
    docstemplate: 'https://{domain}/{user}/{project}{/tree/committish}#readme',
    httpstemplate: 'git+https://{auth@}{domain}/{user}/{project}.git{#committish}',
    shortcuttemplate: '{type}:{user}/{project}{#committish}',
    pathtemplate: '{user}/{project}{#committish}',
    pathmatch: /^[\/]([^\/]+)[\/]([^\/]+?)(?:[.]git)?$/,
    protocols_re: /^(git|http|git\+ssh|git\+https|ssh|https):$/,
    user: 'stevemao',
    auth: null,
    project: 'get-pkg-repo',
    committish: null,
    default: 'https' }
  */
})
```


## API

`getPkgRepo(pkgData, [fixTypo])`

Returns a [`hosted-git-info`](https://github.com/npm/hosted-git-info) returned object if it matches a git host. If not, it returns a `url.parse` object with a `browse` function which returns the url that can be browsed.

### pkgData

Type: `object` or `json`

Should be the contents of a `package.json` file.

Contents of `pkgData` are mutated/normalized by `normalize-package-data`.

### fixTypo

Type: `boolean`

If you want to fix your typical typos automatically pass `true`.

> Please keep in mind that this feature may be removed in the future. The [`repository`](https://docs.npmjs.com/files/package.json#repository) field in `package.json` is well documented and it should be correctly spelled.

## CLI

```sh
$ npm install --global get-pkg-repo
```

You can use cli to see what your url will look like after being parsed.

You can enter interactive mode by typing

```sh
$ get-pkg-repo
https://github.com/stevemao/get-pkg-repo
{ type: 'github',
  protocols: [ 'git', 'http', 'git+ssh', 'git+https', 'ssh', 'https' ],
  domain: 'github.com',
  treepath: 'tree',
  filetemplate: 'https://{auth@}raw.githubusercontent.com/{user}/{project}/{committish}/{path}',
  bugstemplate: 'https://{domain}/{user}/{project}/issues',
  gittemplate: 'git://{auth@}{domain}/{user}/{project}.git{#committish}',
  sshtemplate: 'git@{domain}:{user}/{project}.git{#committish}',
  sshurltemplate: 'git+ssh://git@{domain}/{user}/{project}.git{#committish}',
  browsetemplate: 'https://{domain}/{user}/{project}{/tree/committish}',
  docstemplate: 'https://{domain}/{user}/{project}{/tree/committish}#readme',
  httpstemplate: 'git+https://{auth@}{domain}/{user}/{project}.git{#committish}',
  shortcuttemplate: '{type}:{user}/{project}{#committish}',
  pathtemplate: '{user}/{project}{#committish}',
  pathmatch: /^[\/]([^\/]+)[\/]([^\/]+?)(?:[.]git)?$/,
  protocols_re: /^(git|http|git\+ssh|git\+https|ssh|https):$/,
  user: 'stevemao',
  auth: null,
  project: 'get-pkg-repo',
  committish: null,
  default: 'https' }
```

You can also validate the repository url in your package.json by using the command followed by a package.json path. You can specify more than one path at a time.

```sh
$ get-pkg-repo package.json
{ type: 'github',
  protocols: [ 'git', 'http', 'git+ssh', 'git+https', 'ssh', 'https' ],
...
# or
$ cat package.json | get-pkg-repo --fix-typo
{ type: 'github',
  protocols: [ 'git', 'http', 'git+ssh', 'git+https', 'ssh', 'https' ],
...
```


## License

MIT © [Steve Mao](https://github.com/stevemao)

[npm-image]: https://badge.fury.io/js/get-pkg-repo.svg
[npm-url]: https://npmjs.org/package/get-pkg-repo
[travis-image]: https://travis-ci.org/stevemao/get-pkg-repo.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/get-pkg-repo
[daviddm-image]: https://david-dm.org/stevemao/get-pkg-repo.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/get-pkg-repo
[coveralls-image]: https://coveralls.io/repos/stevemao/get-pkg-repo/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/get-pkg-repo
