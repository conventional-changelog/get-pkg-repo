'use strict';
var normalizeData = require('normalize-package-data');
var parseGithubUrl = require('github-url-from-git');
var url = require('url');
var forEach = require('lodash.foreach');
var typos = require('./typos');

function parseNonGithubUrl(nonGithubUrl) {
  try {
    var idx = nonGithubUrl.indexOf('@');
    if (idx !== -1) {
      nonGithubUrl = nonGithubUrl.slice(idx + 1).replace(/:([^\d]+)/, '/$1');
    }
    nonGithubUrl = url.parse(nonGithubUrl);
    var protocol = nonGithubUrl.protocol === 'https:' ?
      'https:' : 'http:';
    return protocol + '//' + (nonGithubUrl.host || '') +
      nonGithubUrl.path.replace(/\.git$/, '');
  } catch (e) {
    return '';
  }
}

function getPkgRepo(pkgData, fixTypo, warn) {
  warn = warn || function() {};

  try {
    pkgData = JSON.parse(pkgData);
  } catch (e) {}

  if (fixTypo && !pkgData.repository) {
    forEach(typos, function(val) {
      if (pkgData[val]) {
        warn(val + ' should probably be repository.');
        pkgData.repository = pkgData[val];
        return false;
      }
    });
  }

  normalizeData(pkgData);

  var url = pkgData.repository && pkgData.repository.url;

  if (typeof url !== 'string') {
    return '';
  }

  return url.indexOf('github') > -1 ?
    parseGithubUrl(url) :
    parseNonGithubUrl(url);
}

module.exports = getPkgRepo;
