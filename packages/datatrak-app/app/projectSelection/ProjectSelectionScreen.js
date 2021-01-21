/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import { getGreyShade } from '../globalStyles';
import { TupaiaHeaderLogo } from '../widgets';

const Card = () => (
  <View
    style={{
      height: 180,
      marginBottom: 10,
      backgroundColor: 'white',
      borderRadius: 3,
      border: '1px solid #E3E3E3',
    }}
  >
    <Text
      style={{
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        color: '#2B2F31',
        fontWeight: '600',
      }}
    >
      Card
    </Text>
  </View>
);

class ProjectSelectionScreenComponent extends PureComponent {
  static navigationOptions = {
    headerTitle: <TupaiaHeaderLogo />,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={localStyles.container}>
        <Text style={localStyles.title}>Select a project</Text>
        <View style={localStyles.grid}>
          <Card />
          <Card />
          <Card />
          <Card />
        </View>
      </View>
    );
  }
}

export const ProjectSelectionScreen = ProjectSelectionScreenComponent;

ProjectSelectionScreen.propTypes = {};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getGreyShade(0.03),
  },
  title: {
    textAlign: 'center',
    marginTop: 30,
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 21,
    color: '#2B2F31',
  },
  grid: {
    paddingTop: 25,
    justifyContent: 'space-evenly',
    alignContent: 'stretch',
    flexWrap: 'wrap',
  },
});
