'use strict';
var assert = require('assert');
var getPkgRepo = require('./');
var parse = function(url, fix) {
  return getPkgRepo({
    repository: {url: url}
  }, fix);
};

var assertRepo = function(repo, expected) {
  assert.equal(repo.browse(), expected.browse);
  assert.equal(repo.type, expected.type);
  assert.equal(repo.user, expected.user);
  assert.equal(repo.project, expected.project);
  assert.equal(repo.committish, expected.committish);
};

it('should parse github http', function() {
  var repo = parse('http://github.com/a/b');
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should parse github https', function() {
  var repo = parse('https://github.com/a/b');
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should parse github ssh', function() {
  var repo = parse('git@github.com:joyent/node.git');
  assertRepo(repo, {
    browse: 'https://github.com/joyent/node',
    type: 'github',
    user: 'joyent',
    project: 'node'
  });
});

it('should parse github short', function() {
  var repo = parse('a/b');
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should parse bitbucket', function() {
  var repo = parse('https://bitbucket.org/a/b.git');
  assertRepo(repo, {
    browse: 'https://bitbucket.org/a/b',
    type: 'bitbucket',
    user: 'a',
    project: 'b'
  });
});

it('should parse svn', function() {
  var repo = parse('svn://a/b');
  assertRepo(repo, {
    browse: 'http://a/b'
  });
});

it('should parse https', function() {
  var repo = parse('https://a/b');
  assertRepo(repo, {
    browse: 'https://a/b'
  });
});

it('should parse a url with an @', function() {
  var repo = parse('a@b.com');
  assertRepo(repo, {
    browse: 'http://b.com'
  });
});

it('should fix bad protocal', function() {
  var repo = parse('badprotocol://a/b');
  assertRepo(repo, {
    browse: 'http://a/b'
  });
});

it('should work with a json', function() {
  var jsonData = JSON.stringify({
    repository: {
      url: 'http://github.com/a/b'
    }
  });
  var repo = getPkgRepo(jsonData);
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should work if there is a typo', function() {
  var repo = getPkgRepo({repo: 'a/b'}, true);
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should error if cannot get repository', function() {
  assert.throws(function() {
    getPkgRepo({});
  });
});

it('should parse github enterprise http url', function() {
  var url = 'http://github.mycompany.dev/user/myRepo#123';
  var repo = parse(url);
  assertRepo(repo, {
    browse: 'http://github.mycompany.dev/user/myRepo',
    user: 'user',
    project: 'myRepo',
    committish: '123',
  });
});
