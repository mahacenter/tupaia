/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { ExpressionParser } from '@tupaia/expression-parser';

let parserInstance: ExpressionParser | null = null;

/**
 * Expression parser instantiation takes around 20 - 30ms
 */
export const getExpressionParserInstance = (): ExpressionParser => {
  if (!parserInstance) {
    parserInstance = new ExpressionParser();
  }
  return parserInstance;
};
