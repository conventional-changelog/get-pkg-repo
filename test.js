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

var bad2 = {
  repository: 'badprotocal://a.com'
};

var badProtocol = {
  repository: 'badprotocol://a/b'
};

var nonGithub = {
  repository: 'bitbucket.org/a/b.git'
};

var nonGithub2 = {
  repository: 'git@bitbucket.org/a/b'
};

var nonGithub3 = {
  repository: 'https://bitbucket.org/a/b'
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

it('has no repository', function() {
  var url = getPkgRepo(bad);
  assert.equal(url, '');
});

it('cannot be parsed', function() {
  var url = getPkgRepo(bad2);
  assert.equal(url, '');
});

it('should fix bad protocal', function() {
  var url = getPkgRepo(badProtocol);
  assert.equal(url, 'http://a/b');
});

it('should work with non-github repo', function() {
  var url = getPkgRepo(nonGithub);
  assert.equal(url, 'http://bitbucket.org/a/b');
});

it('should work with non-github repo with an @', function() {
  var url = getPkgRepo(nonGithub2);
  assert.equal(url, 'http://bitbucket.org/a/b');
});

it('should work with https non-github repo', function() {
  var url = getPkgRepo(nonGithub3);
  assert.equal(url, 'https://bitbucket.org/a/b');
});
