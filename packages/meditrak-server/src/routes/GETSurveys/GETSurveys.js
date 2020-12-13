/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { GETHandler } from '../GETHandler';
import {
  assertSurveyPermissions,
  createSurveyDBFilter,
  createSurveyViaCountryDBFilter,
} from './assertSurveyPermissions';
import { assertAnyPermissions, assertBESAdminAccess } from '../../permissions';

/**
 * Handles endpoints:
 * - /surveys
 * - /surveys/id
 * - /countries/id/surveys
 */

export class GETSurveys extends GETHandler {
  permissionsFilteredInternally = true;

  async findSingleRecord(surveyId, options) {
    const survey = await super.findSingleRecord(surveyId, options);

    const surveyChecker = accessPolicy =>
      assertSurveyPermissions(accessPolicy, this.models, surveyId);

    await this.assertPermissions(assertAnyPermissions([assertBESAdminAccess, surveyChecker]));

    return survey;
  }

  async findRecords(criteria, options) {
    const dbConditions = await createSurveyDBFilter(this.accessPolicy, this.models, criteria);
    return super.findRecords(dbConditions, options);
  }

  async findRecordsViaParent(criteria, options) {
    const dbConditions = await createSurveyViaCountryDBFilter(
      this.accessPolicy,
      this.models,
      criteria,
      this.parentRecordId,
    );
    return super.findRecords(dbConditions, options);
  }
}