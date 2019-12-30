/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 **/

import cached from 'cached';

export const CACHE_KEY_GENERATORS = {
  accessPolicy: userId => `accessPolicy.${userId}`,
  userPermissionGroups: (userId, countryIdentifier) =>
    `userPermissionGroups.${userId}.${countryIdentifier}`,
  userRewards: userId => `userRewards.${userId}`,
  leaderboard: () => 'socialLeaderboard',
};

/**
 * Meditrak server memory cache instance.
 *
 * View the documentation at https://www.npmjs.com/package/cached. All caches on
 * meditrak server expire fairly quickly unless overriden.
 * Examples:
 *
 * - await cache.get(CACHE_KEY_GENERATORS.accessPolicy(2343));
 * - await cache.set(CACHE_KEY_GENERATORS.accessPolicy(2343), accessPolicyData);
 *
 * // To get a value if it exists or set it and return it when it doesn't use the following.
 * - await cache.getOrElse(CACHE_KEY_GENERATORS.accessPolicy(2343), () => getAccessPolicy(2343));
 */
export const cache = cached('meditrak-server', {
  backend: {
    type: 'memory',
  },
  defaults: {
    expire: 20,
  },
});
