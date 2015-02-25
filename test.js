/*global it */
'use strict';
var assert = require('assert');
var getPkgRepo = require('./');

var good = {
  repository: 'https://github.com/a/b'

};

var good2 = {
  repository: 'a/b'
};

var typo = {
  repo: 'a/b'
};

var bad = {};

var nonGithub = {
  repository: 'bitbucket.org/a/b.git'
};

it('should get repo url', function() {
  var url = getPkgRepo(good);
  assert.equal(url, 'https://github.com/a/b');
});

it('should work with github repo', function() {
  var url = getPkgRepo(good2);
  assert.equal(url, 'https://github.com/a/b');
});

it('should work with a json', function() {
  var jsonData = JSON.stringify(good);
  var url = getPkgRepo(jsonData);
  assert.equal(url, 'https://github.com/a/b');
});

it('should work if there is a typo', function() {
  var url = getPkgRepo(typo, true);
  assert.equal(url, 'https://github.com/a/b');
});

it('should return an empty string', function() {
  var url = getPkgRepo(bad);
  assert.equal(url, '');
});

it('should work with non-github repo', function() {
  var url = getPkgRepo(nonGithub);
  assert.equal(url, 'http://bitbucket.org/a/b');
});
