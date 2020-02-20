/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { ChangeSideEffectHandler } from '../externalApiSync';

export class DhisChangeSideEffectHandler extends ChangeSideEffectHandler {
  triggerSideEffects = async changes => {
    // If an event based answer is added, updated, or deleted, trigger an update to its parent
    // survey response, as event based answers sync to dhis2 as a whole response
    const allAnswerIds = this.getIdsFromChangesForModel(changes, this.models.answer);
    console.log('Triggering for', allAnswerIds.length);
    const responsesToMarkAsChangedById = {};
    const batchSize = this.models.database.maxBindingsPerQuery;
    for (let i = 0; i < allAnswerIds.length; i += batchSize) {
      const batchOfAnswerIds = allAnswerIds.slice(i, i + batchSize);
      console.log('Looking up event based responses for', batchOfAnswerIds.length);
      const batchOfResponses = await this.models.database.executeSql(
        `
          SELECT DISTINCT survey_response.*
          FROM answer
          JOIN survey_response ON answer.survey_response_id = survey_response.id
          JOIN survey ON survey_response.survey_id = survey.id
          JOIN entity ON survey_response.entity_id = entity.id
          WHERE answer.id IN (${batchOfAnswerIds.map(() => '?').join(',')})
          AND ${this.models.surveyResponse.getOnlyEventsQueryClause()};
        `,
        batchOfAnswerIds,
      );
      console.log('Found', batchOfResponses.length);
      batchOfResponses.forEach(r => {
        responsesToMarkAsChangedById[r.id] = r;
      });
      console.log('Added to object');
    }
    const responsesToMarkAsChanged = Object.values(responsesToMarkAsChangedById);
    console.log(
      'Marking as changed',
      responsesToMarkAsChanged.length,
      'from',
      allAnswerIds.length,
      'answers of',
      changes.length,
      'changes',
    );
    await this.models.surveyResponse.markRecordsAsChanged(responsesToMarkAsChanged);
  };
}
