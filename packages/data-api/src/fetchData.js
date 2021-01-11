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

async function fetchPage(query) {
  const s = Date.now();
  const response = await fetchWithTimeout(
    'https://search-tupaia-test-s3mzchqqwhorlsgw7stw7kpwc4.ap-southeast-2.es.amazonaws.com/analytics_test_mon_2/_search',
    {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  console.log('request took', Date.now() - s);
  const d = Date.now();
  const r = await response.json();
  console.log('json took', Date.now() - d);
  return r;
}

export async function fetchAnalyticData(database, options) {
  const baseQuery = generateBaseQuery(options);
  const results = [];
  let checkForNextPage = true;
  while (checkForNextPage) {
    const s = Date.now();
    const lastResult = results.length > 0 ? results[results.length - 1] : null;
    const query = lastResult ? { ...baseQuery, search_after: lastResult.sort } : baseQuery;
    // response format: { ..., hits: { total: { value: 100, relation: 'gte' }, hits: [{...}, {...}] } }
    const { hits, took } = await fetchPage(query);
    results.push(...hits.hits);
    checkForNextPage = hits.hits.length >= 9999;
    console.log('page took', Date.now() - s, 'number results', hits.hits.length, 'es took', took);
  }
  return results.map(({ _source: analytic }) => ({
    surveyResponseId: analytic.survey_response_id,
    date: analytic.date_of_data,
    entityCode: analytic.entity_code,
    entityName: analytic.entity_name,
    dataElementCode: analytic.data_element_code,
    type: analytic.type,
    value: analytic.value,
  }));
}
