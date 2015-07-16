'use strict';
var assert = require('assert');
var getPkgRepo = require('./');

it('should parse github http', function() {
  var repo = getPkgRepo({
    repository: {
      url: 'http://github.com/a/b'
    }
  });

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse github https', function() {
  var repo = getPkgRepo({
    repository: {
      url: 'https://github.com/a/b'
    }
  });

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse github ssh', function() {
  var repo = getPkgRepo({
    repository: 'git@github.com:joyent/node.git'
  });

  assert.equal(repo.browse(), 'https://github.com/joyent/node');
  assert.equal(repo.type, 'github');
});

it('should parse github short', function() {
  var repo = getPkgRepo({
    repository: 'a/b'
  });

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse bitbucket', function() {
  var repo = getPkgRepo({
    repository: 'https://bitbucket.org/a/b.git'
  });

  assert.equal(repo.type, 'bitbucket');
  assert.equal(repo.browse(), 'https://bitbucket.org/a/b');
});

it('should parse svn', function() {
  var repo = getPkgRepo({
    repository: 'svn://a/b'
  });

  assert.equal(repo.browse(), 'http://a/b');
});

it('should parse https', function() {
  var repo = getPkgRepo({
    repository: 'https://a/b'
  });

  assert.equal(repo.browse(), 'https://a/b');
});

it('should parse a url with an @', function() {
  var repo = getPkgRepo({
    repository: 'a@b.com'
  });

  assert.equal(repo.browse(), 'http://b.com');
});

it('should fix bad protocal', function() {
  var repo = getPkgRepo({
    repository: 'badprotocol://a/b'
  });

  assert.equal(repo.browse(), 'http://a/b');
  assert.equal(repo.type, undefined);
  assert.equal(repo.protocol, 'badprotocol:');
});

it('should work with a json', function() {
  var jsonData = JSON.stringify({
    repository: {
      url: 'http://github.com/a/b'
    }
  });
  var repo = getPkgRepo(jsonData);

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should work if there is a typo', function() {
  var repo = getPkgRepo({
    repo: 'a/b'
  }, true);

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should error if cannot get repository', function() {
  assert.throws(function() {
    getPkgRepo({});
  });
});
