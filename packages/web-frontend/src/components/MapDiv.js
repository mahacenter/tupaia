/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

/**
 * MapDiv
 *
 * Visual flex arranged div used for laying out the map controls on the screen such as SearchBar,
 * LocationBar, UserBar the map controls. Probably a custom attribution as well.
 */
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import MapControl from '../containers/MapControl';
import MeasureLegend from '../containers/MeasureLegend';
import MeasureBar from '../containers/MeasureBar';
import { CONTROL_BAR_PADDING } from '../styles';

const FlexDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  padding: ${CONTROL_BAR_PADDING}px;
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  padding: 10px 10px 0px 10px;
`;

export class MapDiv extends PureComponent {
  render() {
    return (
      <FlexDiv>
        <TopRow>
          <MeasureBar />
        </TopRow>
        <BottomRow>
          <MeasureLegend />
          <MapControl />
        </BottomRow>
      </FlexDiv>
    );
  }
}
