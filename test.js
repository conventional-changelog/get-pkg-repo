'use strict';
var assert = require('assert');
var getPkgRepo = require('./');

var githubHttp = {
  repository: 'http://github.com/a/b'
};

var githubHttps = {
  repository: 'https://github.com/a/b'
};

var githubSsh = {
  repository: 'git@github.com:joyent/node.git'
};

var githubSvn = {
  repository: 'https://github.com/joyent/node'
};

var githubShort = {
  repository: 'a/b'
};

var bitbucket = {
  repository: 'https://bitbucket.org/a/b.git'
};

var typo = {
  repo: 'a/b'
};

var badProtocol = {
  repository: 'badprotocol://a/b'
};

var bad = {};

it('should parse github http', function() {
  var repo = getPkgRepo(githubHttp);
  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse github https', function() {
  var repo = getPkgRepo(githubHttps);
  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse github ssh', function() {
  var repo = getPkgRepo(githubSsh);
  assert.equal(repo.browse(), 'https://github.com/joyent/node');
  assert.equal(repo.type, 'github');
});

it('should parse github svn', function() {
  var repo = getPkgRepo(githubSvn);
  assert.equal(repo.browse(), 'https://github.com/joyent/node');
  assert.equal(repo.type, 'github');
});

it('should parse github short', function() {
  var repo = getPkgRepo(githubShort);
  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should work with bitbucket', function() {
  var repo = getPkgRepo(bitbucket);
  assert.equal(repo.type, 'bitbucket');
  assert.equal(repo.browse(), 'https://bitbucket.org/a/b');
});

it('should work if there is a typo', function() {
  var repo = getPkgRepo(typo, true);
  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should fix bad protocal', function() {
  var repo = getPkgRepo(badProtocol);
  assert.equal(repo.browse(), 'http://a/b');
  assert.equal(repo.type, undefined);
  assert.equal(repo.protocol, 'badprotocol:');
});

it('should work with a json', function() {
  var jsonData = JSON.stringify(githubHttp);
  var repo = getPkgRepo(jsonData);
  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should error if cannot get repository', function() {
  assert.throws(function() {
    getPkgRepo(bad);
  });
});
