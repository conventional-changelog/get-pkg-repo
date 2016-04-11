'use strict';
var parseSlug = require('@bahmutov/parse-github-repo-url');
var normalizeData = require('normalize-package-data');
var hostedGitInfo = require('hosted-git-info');
var url = require('url');
var typos = require('./typos');

var GenericRepo = function(repository) {
  var slug = parseSlug(repository);
  this.url = url.parse(repository);
  this.user = slug[0];
  this.project = slug[1];
  this.committish = slug[2];
};

GenericRepo.prototype.browse = function() {
  var protocol = this.url.protocol === 'https:' ? 'https:' : 'http:';
  return protocol + '//' + (this.url.host || '') + this.url.path.replace(/\.git$/, '');
};

function unknownHostedInfo(repoUrl) {
  try {
    var index = repoUrl.indexOf('@');
    if (index !== -1) {
      repoUrl = repoUrl.slice(index + 1).replace(/:([^\d]+)/, '/$1');
    }
    return new GenericRepo(repoUrl);
  } catch (err) {}
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
