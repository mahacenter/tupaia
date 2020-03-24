/**
 * Tupaia Config Server
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 */

/**
 * Map a given dataElement to a different name for each orgUnit
 *
 * eg:
 *
 * results = [
 *  { organisationUnit: 'AU_SA', dataElement: 'dailySurvey003', value: 7 },
 *  { organisationUnit: 'AU_SA', dataElement: 'dailySurvey004', value: 4 },
 *  { organisationUnit: 'AU_VIC', dataElement: 'dailySurvey003', value: 9 },
 * ];
 *
 * select(results, 'dailySurvey003', 'value')
 *  => [
 *  { organisationUnit: 'AU_SA', dataElement: 'value', value: 7 },
 *  { organisationUnit: 'AU_SA', dataElement: 'dailySurvey004', value: 4 },
 *  { organisationUnit: 'AU_VIC', dataElement: 'value', value: 9 },
 * ]
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

/**
 * Subtract a given dataElement from another for each orgUnit (removes the subtracted dataElement from the results)
 *
 * eg:
 *
 * results = [
 *  { organisationUnit: 'AU_SA', dataElement: 'dailySurvey003', value: 7 },
 *  { organisationUnit: 'AU_SA', dataElement: 'dailySurvey004', value: 4 },
 *  { organisationUnit: 'AU_VIC', dataElement: 'dailySurvey003', value: 9 },
 * ];
 *
 * select(results, 'dailySurvey003', 'dailySurvey004')
 *  => [
 *  { organisationUnit: 'AU_SA', dataElement: 'dailySurvey003', value: 3 },
 *  { organisationUnit: 'AU_VIC', dataElement: 'value', value: 9 },
 * ]
 */
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
