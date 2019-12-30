/**
 * Tupaia MediTrak
 * Copyright (c) 2018 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '../../widgets';
import { requestDeleteRecord } from '../actions';

const DeleteButtonComponent = ({ dispatch, value, actionConfig, reduxId }) => (
  <IconButton
    icon={'minus-circle'}
    onClick={() => dispatch(requestDeleteRecord(reduxId, actionConfig.endpoint, value))}
  />
);

DeleteButtonComponent.propTypes = {
  actionConfig: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  reduxId: PropTypes.string.isRequired,
};

export const DeleteButton = connect()(DeleteButtonComponent);
