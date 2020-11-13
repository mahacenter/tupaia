/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { compareAsc, compareDesc } from '../compare';

describe('compare', () => {
  const testData = [
    ['strings <', ['alpha', 'beta'], -1],
    ['strings =', ['alpha', 'alpha'], 0],
    ['strings >', ['beta', 'alpha'], 1],
    ['strings - one includes the other', ['alpha', 'alpha_'], -1],
    ['strings - case sensitivity', ['alpha', 'alphA'], -1],
    ['strings - correct numeric comparison', ['10', '2'], 1],
    ['numbers <', [1, 2], -1],
    ['numbers =', [1, 1], 0],
    ['numbers >', [10, 1], 1],
    ['numbers - negative', [1, -100], 1],
  ];

  describe('compareAsc', () => {
    it.each(testData)('%s', (_, [a, b], expected) => {
      expect(compareAsc(a, b)).toBe(expected);
    });
  });

  describe('compareDesc', () => {
    it.each(testData)('%s', (_, [a, b], expected) => {
      expect(compareDesc(a, b)).toBe(expected * -1);
    });
  });
});
