/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  YES_COLOR,
  NO_COLOR,
  BREWER_AUTO,
  UNKNOWN_COLOR,
  resolveSpectrumColour,
} from '../components/Marker/markerColors';
import { SPECTRUM_ICON, DEFAULT_ICON, UNKNOWN_ICON } from '../components/Marker/markerIcons';
import { MAP_COLORS } from '../styles';
import { formatDataValue } from './formatters';
import { SCALE_TYPES } from '../constants';
import { VALUE_TYPES } from '../components/View/constants';

// At a few places throughout this module we're iterating over a collection
// while modifying an object, which trips up the eslint rule that expects inline
// functions to return a value.
// We could re-write them as reducers, but in this case it splits up the logic
// in a way that is more difficult to follow.
//
// So, just disable this rule for this file.
/* eslint-disable array-callback-return */

export const MEASURE_TYPE_ICON = 'icon';
export const MEASURE_TYPE_COLOR = 'color';
export const MEASURE_TYPE_RADIUS = 'radius';
export const MEASURE_TYPE_SPECTRUM = 'spectrum';
export const MEASURE_TYPE_SHADING = 'shading';
export const MEASURE_TYPE_SHADED_SPECTRUM = 'shaded-spectrum';

export const MEASURE_VALUE_OTHER = 'other';
export const MEASURE_VALUE_NULL = 'null';

export const POLYGON_MEASURE_TYPES = [MEASURE_TYPE_SHADING, MEASURE_TYPE_SHADED_SPECTRUM];

export function autoAssignColors(values) {
  if (!values) return [];

  let autoIndex = 0;
  const getColor = valueObject => {
    switch (valueObject.name.toLowerCase()) {
      case 'yes':
        return YES_COLOR;
      case 'no':
        return NO_COLOR;
      default:
        return BREWER_AUTO[autoIndex++];
    }
  };

  return values.map(v => ({
    ...v,
    color: v.color || getColor(v),
  }));
}

export function createValueMapping(valueObjects, type) {
  const mapping = {};

  valueObjects.map(valueObject => {
    const { value } = valueObject;

    if (Array.isArray(value)) {
      value.map(v => {
        mapping[v] = valueObject;
      });
    } else {
      mapping[value] = valueObject;
    }
  });

  // add a "no data" object to the mapping if there isn't one present already
  const requiresNull = !Object.keys(mapping).some(k => k === MEASURE_VALUE_NULL);
  if (requiresNull) {
    switch (type) {
      case MEASURE_TYPE_ICON:
        mapping.null = { icon: UNKNOWN_ICON, name: 'No data' };
        break;
      case MEASURE_TYPE_SHADING:
      case MEASURE_TYPE_COLOR:
        mapping.null = { color: UNKNOWN_COLOR, name: 'No data' };
        break;
      case MEASURE_TYPE_RADIUS:
        mapping.null = { name: 'No data' };
        break;
      case MEASURE_TYPE_SPECTRUM:
      case MEASURE_TYPE_SHADED_SPECTRUM:
        mapping.null = { name: 'No data' };
        break;
      default:
        break;
    }
  }

  return mapping;
}

function getFormattedValue(value, type, valueInfo, scaleType, valueType) {
  switch (type) {
    case MEASURE_TYPE_SPECTRUM:
    case MEASURE_TYPE_SHADED_SPECTRUM:
      if (scaleType === SCALE_TYPES.TIME) {
        return `last submission on ${value}`;
      }
      return formatDataValue(value, valueType);
    case MEASURE_TYPE_RADIUS:
    case MEASURE_TYPE_ICON:
    case MEASURE_TYPE_COLOR:
    case MEASURE_TYPE_SHADING:
      return valueInfo.name || value;
    default:
      return value;
  }
}

const getSpectrumScaleValues = (measureData, measureOption) => {
  const { key, scaleType, valueType, scaleMin, scaleMax, startDate, endDate } = measureOption;

  if (scaleType === SCALE_TYPES.TIME) {
    return { min: startDate, max: endDate };
  }

  const flattenedMeasureData = flattenNumericalMeasureData(measureData, key);

  if (valueType === VALUE_TYPES.PERCENTAGE) {
    return getExtremesOfData(
      scaleMin || 0,
      scaleMax === 'auto' ? null : scaleMax || 1,
      flattenedMeasureData,
    );
  }

  return getExtremesOfData(scaleMin, scaleMax, flattenedMeasureData);
};

const getExtremesOfData = (manualMin, manualMax, data) => {
  console.log(manualMax, manualMin, data);
  // coerce to number before checking for isNan, identical to "isNaN(scaleMin)". Allows for '0' and true to be valid
  const hasNumberScaleMin = !Number.isNaN(Number(manualMin));
  const hasNumberScaleMax = !Number.isNaN(Number(manualMax));

  return {
    min: hasNumberScaleMin ? Math.min(manualMin, ...data) : Math.min(...data),
    max: hasNumberScaleMax ? Math.max(manualMax, ...data) : Math.max(...data),
  };
};

export function processMeasureInfo(response) {
  const { measureOptions, measureData, ...rest } = response;
  const hiddenMeasures = {};
  const processedOptions = measureOptions.map(measureOption => {
    const { values: mapOptionValues, type, scaleType } = measureOption;
    const values = autoAssignColors(mapOptionValues);
    const valueMapping = createValueMapping(values, type);

    hiddenMeasures[measureOption.key] = measureOption.hideByDefault;

    if (POLYGON_MEASURE_TYPES.includes(type)) {
      // for each spectrum, include the minimum and maximum values for
      // use in the legend scale labels.
      const { min, max } = getSpectrumScaleValues(measureData, measureOption);

      // A grey no data colour looks like part of the neutral scale
      const noDataColour = scaleType === SCALE_TYPES.NEUTRAL ? 'black' : MAP_COLORS.NO_DATA;

      console.log(values, valueMapping);
      return {
        ...measureOption,
        values,
        valueMapping,
        min,
        max,
        noDataColour,
      };
    }

    return {
      ...measureOption,
      values,
      valueMapping,
    };
  });

  return {
    measureOptions: processedOptions,
    hiddenMeasures,
    measureData,
    ...rest,
  };
}

export function getValueInfo(value, valueMapping, hiddenValues = {}) {
  if (!value && typeof value !== 'number' && valueMapping.null) {
    // use 'no data' value
    const nullValue = hiddenValues.null || hiddenValues[valueMapping.null.name];

    return {
      ...valueMapping.null,
      isHidden: nullValue,
    };
  }

  const matchedValue = valueMapping[value];

  if (!matchedValue) {
    // use 'other' value
    return {
      ...valueMapping.other,
      isHidden: hiddenValues.other,
      value,
    };
  }

  return {
    ...matchedValue,
    isHidden: hiddenValues[matchedValue.value],
  };
}

export function getFormattedInfo(orgUnitData, measureOption) {
  const { key, valueMapping, type, displayedValueKey, scaleType, valueType } = measureOption;

  if (displayedValueKey && orgUnitData[displayedValueKey]) {
    return { value: orgUnitData[displayedValueKey] };
  }

  const value = orgUnitData[key];
  const valueInfo = getValueInfo(value, valueMapping);

  // note: dont use !value here, as 0 is a valid value.
  if (value === null || value === undefined) return { value: valueInfo.name || 'No data' };

  return {
    value: getFormattedValue(value, type, valueInfo, scaleType, valueType),
  };
}

export function getSingleFormattedValue(orgUnitData, measureOptions) {
  // For situations where we can only show one value, just show the value
  // of the first measure.
  return getFormattedInfo(orgUnitData, measureOptions[0]).value;
}

export function getMeasureDisplayInfo(measureData, measureOptions, hiddenMeasures = {}) {
  const displayInfo = {};

  measureOptions.forEach(({ color, icon, radius }) => {
    if (color) {
      displayInfo.color = color;
    }
    if (icon) {
      displayInfo.icon = icon;
    }
    if (radius) {
      displayInfo.radius = radius;
    }
  });
  measureOptions.forEach(
    ({ key, type, valueMapping, noDataColour, scaleType, min, max, hideByDefault }) => {
      const valueInfo = getValueInfo(measureData[key], valueMapping, {
        ...hideByDefault,
        ...hiddenMeasures[key],
      });
      switch (type) {
        case MEASURE_TYPE_ICON:
          displayInfo.icon = valueInfo.icon;
          displayInfo.color = displayInfo.color || valueInfo.color;
          break;
        case MEASURE_TYPE_RADIUS:
          displayInfo.radius = valueInfo.value || 0;
          displayInfo.color = displayInfo.color || valueInfo.color;
          break;
        case MEASURE_TYPE_SPECTRUM:
        case MEASURE_TYPE_SHADED_SPECTRUM:
          displayInfo.originalValue =
            valueInfo.value === null || valueInfo.value === undefined ? 'No data' : valueInfo.value;
          displayInfo.color = resolveSpectrumColour(
            scaleType,
            valueInfo.value || (valueInfo.value === 0 ? 0 : null),
            min,
            max,
            noDataColour,
          );
          displayInfo.icon = SPECTRUM_ICON;
          break;
        case MEASURE_TYPE_SHADING:
          displayInfo.color = MAP_COLORS[valueInfo.color] || MAP_COLORS.NO_DATA;
          break;
        case MEASURE_TYPE_COLOR:
        default:
          displayInfo.color = valueInfo.color;
          break;
      }
      if (valueInfo.isHidden) {
        displayInfo.isHidden = true;
      }
    },
  );

  if (!displayInfo.icon && typeof displayInfo.radius === 'undefined') {
    displayInfo.icon = DEFAULT_ICON;
  }

  if (!displayInfo.color) {
    displayInfo.color = UNKNOWN_COLOR;
  }

  return displayInfo;
}

const MAX_ALLOWED_RADIUS = 1000;
export const calculateRadiusScaleFactor = measureData => {
  // Check if any of the radii in the dataset are larger than the max allowed
  // radius, and scale everything down proportionally if so.
  // (this needs to happen here instead of inside the circle marker component
  // because it needs to operate on the dataset level, not the datapoint level)
  const maxRadius = measureData
    .map(d => parseInt(d.radius, 10) || 1)
    .reduce((state, current) => Math.max(state, current), 0);
  return maxRadius < MAX_ALLOWED_RADIUS ? 1 : (1 / maxRadius) * MAX_ALLOWED_RADIUS;
};

// Take a measureData array where the [key]: value is a number
// and filters NaN values (e.g. undefined).
export function flattenNumericalMeasureData(measureData, key) {
  // eslint-disable-next-line no-restricted-globals
  return measureData.map(v => parseFloat(v[key])).filter(x => !isNaN(x));
}
