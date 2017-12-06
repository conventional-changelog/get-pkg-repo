'use strict';
var assert = require('assert');
var getPkgRepo = require('./');
var parse = function(url, fix) {
  return getPkgRepo({
    repository: {url: url}
  }, fix);
};

var assertRepo = function(repo, expected) {
  assert.strictEqual(repo.browse(), expected.browse);
  assert.strictEqual(repo.domain, expected.domain);
  assert.strictEqual(repo.type, expected.type);
  assert.strictEqual(repo.user, expected.user);
  assert.strictEqual(repo.project, expected.project);
};

it('should parse github http', function() {
  var repo = parse('http://github.com/a/b');
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    domain: 'github.com',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should parse github https', function() {
  var repo = parse('https://github.com/a/b');
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    domain: 'github.com',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should parse github ssh', function() {
  var repo = parse('git@github.com:joyent/node.git');
  assertRepo(repo, {
    browse: 'https://github.com/joyent/node',
    domain: 'github.com',
    type: 'github',
    user: 'joyent',
    project: 'node'
  });
});

it('should parse private gitlab ssh', function() {
  var repo = parse('git@gitlab.team.com:username/test.git');
  assertRepo(repo, {
    browse: 'https://gitlab.team.com/username/test',
    domain: 'gitlab.team.com',
    type: 'gitlab',
    user: 'username',
    project: 'test'
  });
});

it('should parse github short', function() {
  var repo = parse('a/b');
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    domain: 'github.com',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should parse bitbucket', function() {
  var repo = parse('https://bitbucket.org/a/b.git');
  assertRepo(repo, {
    browse: 'https://bitbucket.org/a/b',
    domain: 'bitbucket.org',
    type: 'bitbucket',
    user: 'a',
    project: 'b'
  });
});

it('should parse svn', function() {
  var repo = parse('svn://a/b');
  assertRepo(repo, {
    browse: 'http://a/b',
    domain: 'a'
  });
});

it('should parse https', function() {
  var repo = parse('https://a/b');
  assertRepo(repo, {
    browse: 'https://a/b',
    domain: 'a'
  });
});

it('should parse a url with an @', function() {
  var repo = parse('a@b.com');
  assertRepo(repo, {
    browse: 'http://a@b.com'
  });
});

it('should fix bad protocal', function() {
  var repo = parse('badprotocol://a/b');
  assertRepo(repo, {
    browse: 'http://a/b',
    domain: 'a'
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
    domain: 'github.com',
    type: 'github',
    user: 'a',
    project: 'b'
  });
});

it('should fallback to repository.type if valid', function() {
  var jsonData = JSON.stringify({
    repository: {
      url: 'http://private.com/',
      type: 'gitlab'
    }
  });
  var repo = getPkgRepo(jsonData);
  assertRepo(repo, {
    browse: 'https://private.com/',
    domain: 'private.com',
    type: 'gitlab'
  });
});

it('should not fallback to repository.type if invalid', function() {
  var jsonData = JSON.stringify({
    repository: {
      url: 'http://private.com/',
      type: 'garbage'
    }
  });
  var repo = getPkgRepo(jsonData);
  assertRepo(repo, {
    browse: 'https://private.com/',
    domain: 'private.com'
  });
});

it('should override repository.type if autodetection works', function() {
  var jsonData = JSON.stringify({
    repository: {
      url: 'http://github.com/',
      type: 'gitlab'
    }
  });
  var repo = getPkgRepo(jsonData);
  assertRepo(repo, {
    browse: 'https://private.com/',
    domain: 'private.com',
    type: 'github'
  });
});

it('should work if there is a typo', function() {
  var repo = getPkgRepo({repo: 'a/b'}, true);
  assertRepo(repo, {
    browse: 'https://github.com/a/b',
    domain: 'github.com',
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
  var url = 'http://github.mycompany.dev/user/myRepo';
  var repo = parse(url);
  assertRepo(repo, {
    browse: 'http://github.mycompany.dev/user/myRepo',
    domain: 'github.mycompany.dev',
    user: 'user',
    project: 'myRepo',
    type: 'github'
  });
});

it('should parse simple unknown host', function() {
  var url = 'https://unknown-host/';
  var repo = parse(url);
  assertRepo(repo, {
    browse: 'https://unknown-host',
    domain: 'unknown-host'
  });
});

it('should parse complex unknown host', function() {
  var url = 'https://stash.local/scm/conventional-changelog/conventional-changelog.git';
  var repo = parse(url);
  assertRepo(repo, {
    browse: 'https://stash.local/scm/conventional-changelog/conventional-changelog',
    domain: 'stash.local'
  });
});

it('should parse weird unknown host', function() {
  var url = 'https://unknown-host/.git';
  var repo = parse(url);
  assertRepo(repo, {
    browse: 'https://unknown-host',
    domain: 'unknown-host'
  });
});
