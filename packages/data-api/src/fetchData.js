/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import { fetchWithTimeout } from '@tupaia/utils';

const generateBaseQuery = ({ dataElementCodes, organisationUnitCodes, startDate, endDate }) => {
  const matchClauses = [];

  matchClauses.push({
    terms: {
      data_element_code: dataElementCodes,
    },
  });

  matchClauses.push({
    terms: {
      entity_code: organisationUnitCodes.map(c => c.replace("'", '')),
    },
  });

  if (startDate && endDate) {
    matchClauses.push({
      range: {
        date_of_data: {
          gte: `${startDate} 00:00:00`,
          lte: `${endDate} 23:59:59`,
        },
      },
    });
  }

  const query = {
    size: 10000,
    sort: [{ date_of_data: { order: 'asc' } }],
    query: { bool: { must: matchClauses } },
  };

  return query;
};

export async function fetchEventData(database, options) {
  return [];
}

export async function fetchAnalyticData(database, options) {
  const response = await fetchWithTimeout('http://localhost:8080/test', {});
  return response.json();
}
