'use strict';
var normalizeData = require('normalize-package-data');
var hostedGitInfo = require('hosted-git-info');
var url = require('url');
var typos = require('./typos');

function unknownHostedInfo(repoUrl) {
  try {
    var index = repoUrl.indexOf('@');
    if (index !== -1) {
      repoUrl = repoUrl.slice(index + 1).replace(/:([^\d]+)/, '/$1');
    }

    var info = url.parse(repoUrl);

    info.browse = function() {
      var protocol = info.protocol === 'https:' ? 'https:' : 'http:';
      return protocol + '//' + (info.host || '') + info.path.replace(/\.git$/, '');
    };

    return info;
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
