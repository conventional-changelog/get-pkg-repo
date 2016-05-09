'use strict';
var parseSlug = require('parse-github-repo-url');
var normalizeData = require('normalize-package-data');
var hostedGitInfo = require('hosted-git-info');
var url = require('url');
var typos = require('./typos');

function unknownHostedInfo(repoUrl) {
  var parsed = url.parse(repoUrl);
  var protocol = parsed.protocol === 'https:' ? 'https:' : 'http:';
  var host = parsed.host;
  var browseUrl = protocol + '//' + (host || '') + parsed.path.replace(/\.git$/, '').replace(/\/$/, '');

  var UnknownGitHost = function() {
    var slug = parseSlug(repoUrl);

    if (host) {
      this.domain = host;
    }

    this.user = slug[0];
    this.project = slug[1];
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
    throw new Error('No repository');
  }

  return hostedGitInfo.fromUrl(repo.url) || unknownHostedInfo(repo.url);
}

module.exports = getPkgRepo;
