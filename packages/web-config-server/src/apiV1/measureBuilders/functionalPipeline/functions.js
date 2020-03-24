/**
 * Tupaia Config Server
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 */

const select = (results, selectionCode, as = selectionCode) => {
  return results.reduce((selectedResults, item) => {
    if (item.dataElement !== selectionCode) {
      return [...selectedResults, item];
    }

    const { dataElement: oldName, ...restOfItem } = item;

    return [...selectedResults, { ...restOfItem, dataElement: as }];
  }, []);
};

const subtract = (results, totalCode, subtractorCode) => {
  return results.reduce(
    (substractedResults, item) => {
      if (item.dataElement !== subtractorCode) {
        return [...substractedResults];
      }

      const totalItem = substractedResults.find(
        result =>
          result.dataElement === totalCode && result.organisationUnit === item.organisationUnit,
      );

      const updatedResults = substractedResults.filter(
        result => result !== item || result !== totalItem,
      );

      return [...updatedResults, { ...totalItem, value: totalItem.value - item.value }];
    },
    [...results],
  );
};

const functions = {
  select,
  subtract,
};

export const applyFunction = ({ function: functionName, arguments: args }, results) => {
  const { [functionName]: fn } = functions;

  if (!fn) {
    throw new Error(`No function defined with name: ${functionName}`);
  }

  return fn(results, ...args);
};
