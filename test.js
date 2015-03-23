'use strict';
var assert = require('assert');
var getPkgRepo = require('./');

var good;
var good2;
var typo;
var bad;
var bad2;
var badProtocol;
var nonGithub;
var nonGithub2;
var nonGithub3;

beforeEach(function() {
  good = {
    repository: 'https://github.com/a/b'
  };

  good2 = {
    repository: 'a/b'
  };

  typo = {
    repo: 'a/b'
  };

  bad = {};

  bad2 = {
    repository: 'badprotocal://a.com'
  };

  badProtocol = {
    repository: 'badprotocol://a/b'
  };

  nonGithub = {
    repository: 'bitbucket.org/a/b.git'
  };

  nonGithub2 = {
    repository: 'git@bitbucket.org/a/b'
  };

  nonGithub3 = {
    repository: 'https://bitbucket.org/a/b'
  };
});

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

it('should warn if there is a typo', function(done) {
  getPkgRepo(typo, true, function(warning) {
    assert.equal(warning, 'repo should probably be repository.');
    done();
  });
});

it('should print warning by `console.warn.bind(console)`', function(done) {
  console.warn = function(data) {
    assert.equal(data, 'repo should probably be repository.');
    done();
  };

  getPkgRepo(typo, true, true);
});

it('has no repository', function() {
  try {
    getPkgRepo(bad);
  } catch (e) {
    assert.equal(e.toString(), 'Error: Cannot get repository');
  }

});

it('cannot be parsed', function() {
  try {
    getPkgRepo(bad2);
  } catch (e) {
    assert.equal(e.toString(), 'Error: Cannot parse non Github Url');
  }
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
