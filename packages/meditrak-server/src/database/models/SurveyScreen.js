/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 **/

import { DatabaseModel } from '../DatabaseModel';
import { DatabaseType } from '../DatabaseType';
import { TYPES } from '..';

class SurveyScreenType extends DatabaseType {
  static databaseType = TYPES.SURVEY_SCREEN;

  static meditrakConfig = {
    minAppVersion: '0.0.1',
  };
}

export class SurveyScreenModel extends DatabaseModel {
  get DatabaseTypeClass() {
    return SurveyScreenType;
  }
}
