/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

export const compareAsc = (a, b) => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, { numeric: true });
  }

  if (a < b) {
    return -1;
  }
  return a > b ? 1 : 0;
};

export const compareDesc = (a, b) => compareAsc(a, b) * -1;
