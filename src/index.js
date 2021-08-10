import {fromUrl} from 'hosted-git-info';
import parseRepositoryURL from '@hutson/parse-repository-url';

export default packageData => {
  if (!packageData || !packageData.repository ||
    (typeof packageData.repository !== 'string' && !packageData.repository.url)) {
    throw new Error(`No valid "repository" data found in package metadata. Please see https://docs.npmjs.com/files/package.json#repository for proper syntax.`);
  }

  const repositoryURL = typeof packageData.repository === 'string' ? packageData.repository : packageData.repository.url;

  return fromUrl(repositoryURL) || parseRepositoryURL(repositoryURL);
};
