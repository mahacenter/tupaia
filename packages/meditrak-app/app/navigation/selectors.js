/**
 * Tupaia MediTrak
 * Copyright (c) 2018 Beyond Essential Systems Pty Ltd
 */
import { SURVEY_SCREEN } from './constants';

const getCurrentRoute = ({ navigation }) =>
  navigation.routes ? navigation.routes[navigation.index] : {};

export const getCurrentRouteName = state => getCurrentRoute(state).routeName;

export const getIsInSurvey = state => getCurrentRouteName(state) === SURVEY_SCREEN;
