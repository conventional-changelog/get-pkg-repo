'use strict';
var parseSlug = require('parse-github-repo-url');
var normalizeData = require('normalize-package-data');
var hostedGitInfo = require('hosted-git-info');
var url = require('url');
var typos = require('./typos');

var gitAt = /^git@/;

function gitAtToHttpsUrl(repoUrl) {
  repoUrl = repoUrl.replace(':', '/');
  repoUrl = repoUrl.replace(gitAt, 'https://');
  return repoUrl;
}

function parseRepoUrl(repoUrl) {
  var parsed = url.parse(repoUrl);
  if (!parsed.host) {
    var gitAt = /^git@/;
    if (gitAt.test(repoUrl)) {
      parsed = url.parse(gitAtToHttpsUrl(repoUrl));
    }
  }
  return parsed;
}

function getType(repo) {
  if (repo.url.indexOf('github') !== -1) {
    return 'github';
  }
  if (repo.url.indexOf('gitlab') !== -1) {
    return 'gitlab';
  }
  if (repo.type === 'github' || repo.type === 'gitlab' ) {
    return repo.type;
  }
}

function unknownHostedInfo(repo) {
  var parsed = parseRepoUrl(repo.url);
  var protocol = parsed.protocol === 'https:' ? 'https:' : 'http:';
  var browseUrl = protocol + '//' + (parsed.host || '') + parsed.path.replace(/\.git$/, '').replace(/\/$/, '');

  var UnknownGitHost = function() {
    var slug = parseSlug(repo.url);

    if (parsed.host) {
      this.domain = parsed.host;
    }

    this.user = slug[0];
    this.project = slug[1];

    this.type = getType(repo);
  };

  UnknownGitHost.prototype.browse = function() {
    return browseUrl;
  };

  return new UnknownGitHost();
}

function getPkgRepo(pkgData, fixTypo) {
  try {
    pkgData = JSON.parse(pkgData);
  } catch (err) {}

  if (fixTypo && !pkgData.repository) {
    typos.forEach(function(val) {
      if (pkgData[val]) {
        pkgData.repository = pkgData[val];
        return false;
      }
    });
  }
  normalizeData(pkgData);

  var repo = pkgData.repository;
  if (!repo || !repo.url) {
    throw new Error('No "repository" field found in your package.json file.' +
      ' Please see https://docs.npmjs.com/files/package.json#repository for proper syntax.');
  }

  return hostedGitInfo.fromUrl(repo.url) || unknownHostedInfo(repo);
}

module.exports = getPkgRepo;
