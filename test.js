'use strict';
var assert = require('assert');
var getPkgRepo = require('./');
var parse = function(url, fix) {
  return getPkgRepo({
    repository: {url: url}
  }, fix);
};

it('should parse github http', function() {
  var repo = parse('http://github.com/a/b');

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse github https', function() {
  var repo = parse('https://github.com/a/b');

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse github ssh', function() {
  var repo = parse('git@github.com:joyent/node.git');

  assert.equal(repo.browse(), 'https://github.com/joyent/node');
  assert.equal(repo.type, 'github');
});

it('should parse github short', function() {
  var repo = parse('a/b');

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should parse bitbucket', function() {
  var repo = parse('https://bitbucket.org/a/b.git');

  assert.equal(repo.type, 'bitbucket');
  assert.equal(repo.browse(), 'https://bitbucket.org/a/b');
});

it('should parse svn', function() {
  var repo = parse('svn://a/b');

  assert.equal(repo.browse(), 'http://a/b');
});

it('should parse https', function() {
  var repo = parse('https://a/b');

  assert.equal(repo.browse(), 'https://a/b');
});

it('should parse a url with an @', function() {
  var repo = parse('a@b.com');

  assert.equal(repo.browse(), 'http://b.com');
});

it('should fix bad protocal', function() {
  var repo = parse('badprotocol://a/b');

  assert.equal(repo.browse(), 'http://a/b');
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
  var repo = getPkgRepo({repo: 'a/b'}, true);

  assert.equal(repo.browse(), 'https://github.com/a/b');
  assert.equal(repo.type, 'github');
});

it('should error if cannot get repository', function() {
  assert.throws(function() {
    getPkgRepo({});
  });
});

it('should parse github enterprise http url', function() {
  var url = 'http://github.mycompany.dev/user/myRepo';
  assert.equal(parse(url).browse(), 'http://github.mycompany.dev/user/myRepo');
  assert.equal(parse(url).user, 'user');
});
