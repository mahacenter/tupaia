/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { ResourcePage } from './ResourcePage';
import { SURVEY_RESPONSE_COLUMNS, ANSWER_COLUMNS } from './SurveyResponsesPage';

export const ENTITIES_COLUMNS = [
  {
    Header: 'Name',
    source: 'name',
  },
  {
    Header: 'Code',
    source: 'code',
  },
  {
    Header: 'Type',
    source: 'type',
  },
  {
    Header: 'Export Survey Responses',
    source: 'id',
    type: 'export',
    width: 200,
    actionConfig: {
      exportEndpoint: 'surveyResponses',
      queryParameter: 'entityIds',
      fileName: '{name} Survey Responses',
    },
  },
];

const COLUMNS = [
  {
    Header: 'Country',
    source: 'country_code',
  },
  ...ENTITIES_COLUMNS,
];

const EXPANSION_CONFIG = [
  {
    title: 'Survey Responses',
    endpoint: 'surveyResponses',
    columns: SURVEY_RESPONSE_COLUMNS,
    joinFrom: 'id',
    joinTo: 'entity_id',
    expansionTabs: [
      {
        title: 'Answers',
        endpoint: 'answers',
        columns: ANSWER_COLUMNS,
        joinFrom: 'id',
        joinTo: 'survey_response_id',
      },
    ],
  },
];

const IMPORT_CONFIG = {
  title: 'Import Entities',
  instruction:
    'Please note that if this is the first time a country is being imported, you will need to restart meditrak-server post-import for it to sync to DHIS2.', // hope to fix one day in https://github.com/beyondessential/meditrak-server/issues/481
  actionConfig: {
    importEndpoint: 'entities',
  },
};

export const EntitiesPage = () => (
  <ResourcePage
    title="Entities"
    endpoint="entities"
    columns={COLUMNS}
    expansionTabs={EXPANSION_CONFIG}
    importConfig={IMPORT_CONFIG}
  />
);
