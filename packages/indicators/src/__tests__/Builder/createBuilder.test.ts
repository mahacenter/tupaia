/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

/* eslint-disable max-classes-per-file */

import { ArithmeticBuilder } from '../../Builder/ArithmeticBuilder';
import { createBuilder } from '../../Builder/createBuilder';

jest.mock('../../Builder/builders', () => {
  const originalModule = jest.requireActual('../../Builder/builders');
  const builders = {
    ...originalModule.builders,
    wrongInterface: class {},
  };

  return {
    __esModule: true,
    ...originalModule,
    builders,
  };
});

describe('createBuilder()', () => {
  it('throws an error if a specified builder does not exist', () => {
    expect(() => createBuilder('wrong')).toThrow(/is not an indicator builder/);
  });

  it('throws an error if the builder does not extend the base Builder class', () => {
    expect(() => createBuilder('wrongInterface')).toThrow(/must extend Builder/);
  });

  it('constructs an existing builder', () => {
    expect(createBuilder('arithmetic')).toBeInstanceOf(ArithmeticBuilder);
  });
});
