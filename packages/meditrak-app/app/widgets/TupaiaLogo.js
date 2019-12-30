/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 **/

import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { G, Path } from 'react-native-svg';

export const TupaiaLogo = ({ style, height, width, white }) => {
  const fill = white ? '#ffffff' : '#007dc2';

  return (
    <View style={style}>
      <Svg version={'1.1'} viewBox={'94 44 379 156'} width={width} height={height}>
        <G>
          <G>
            <Path
              fill={'#ec632d'}
              d={
                'M390.896,83.224 C401.834,83.224,410.701,74.445,410.701,63.615 C410.701,52.785,401.834,44.005,390.896,44.005 C379.958,44.005,371.091,52.785,371.091,63.615 C371.091,74.445,379.958,83.224,390.896,83.224'
              }
            />
            <Path
              fill={'#ec632d'}
              d={
                'M388.855,98.872 C388.855,98.872,390.901,102.848,392.948,98.872 L410.177,65.394 C410.177,65.394,412.223,61.418,407.75,61.418 L374.054,61.418 C374.054,61.418,369.582,61.418,371.627,65.394 L388.855,98.872 Z'
              }
            />
            <Path
              fill={'#fff'}
              d={
                'M390.896,77.937 C398.885,77.937,405.361,71.525,405.361,63.615 C405.361,55.705,398.885,49.293,390.896,49.293 C382.907,49.293,376.431,55.705,376.431,63.615 C376.431,71.525,382.907,77.937,390.896,77.937'
              }
            />
          </G>
          <Path
            fill={'#ec632d'}
            d={
              'M389.47,62.23 L383.94,62.23 L383.94,64.998 L389.47,64.998 L389.503,70.435 L392.404,70.435 L392.371,64.998 L397.901,64.998 L397.901,62.23 L392.371,62.23 L392.371,56.794 L389.454,56.794 Z'
            }
          />
          <Path
            fill={'none'}
            stroke={'#000'}
            strokeWidth={'3.76'}
            d={
              'M389.47,62.23 L383.94,62.23 L383.94,64.998 L389.47,64.998 L389.503,70.435 L392.404,70.435 L392.371,64.998 L397.901,64.998 L397.901,62.23 L392.371,62.23 L392.371,56.794 L389.454,56.794 Z'
            }
          />
          <Path
            fill={fill}
            d={
              'M94.793,83.432 L94.793,98.594 L124.319,98.594 L124.319,177.95 L140.811,177.95 L140.811,98.594 L170.337,98.594 L170.337,83.432 Z'
            }
          />
          <G>
            <Path
              fill={fill}
              d={
                'M201.128,147.359 C201.128,158.265,194.611,164.782,185.301,164.782 C175.725,164.782,170.272,158.531,170.272,147.626 L170.272,107.726 L154.18,107.726 L154.18,152.414 C154.18,168.773,163.357,177.996,179.184,177.996 C190.09,177.996,196.607,173.694,201.129,167.045 L201.129,177.95 L217.222,177.95 L217.222,107.726 L201.129,107.726 L201.129,147.359 Z'
              }
            />
            <Path
              fill={fill}
              d={
                'M285.095,142.838 C285.095,156.803,276.051,165.447,265.012,165.447 C254.106,165.447,244.53,156.536,244.53,142.838 C244.53,129.139,254.106,120.228,265.012,120.228 C275.918,120.228,285.095,129.006,285.095,142.838 M301.453,142.838 C301.453,119.43,285.36,106.263,268.735,106.263 C257.43,106.263,250.115,112.115,244.928,119.43 L244.928,107.726 L228.835,107.726 L228.835,199.23 L244.928,199.23 L244.928,167.044 C249.849,173.561,257.164,177.995,268.735,177.995 C285.494,177.995,301.453,166.245,301.453,142.838'
              }
            />
            <Path
              fill={fill}
              d={
                'M355.896,152.547 C355.896,161.324,347.916,167.31,337.275,167.31 C329.695,167.31,323.71,163.586,323.71,156.936 L323.71,156.67 C323.71,149.487,329.695,145.364,339.803,145.364 C346.055,145.364,351.774,146.561,355.897,148.157 L355.897,152.547 Z M371.457,177.949 L371.457,136.32 C371.457,117.567,361.35,106.661,340.602,106.661 C329.164,106.661,321.582,109.056,313.869,112.514 L318.258,125.414 C324.642,122.755,330.494,121.025,338.341,121.025 C349.513,121.025,355.631,126.345,355.631,136.054 L355.631,137.783 C350.178,136.054,344.726,134.857,336.213,134.857 C319.855,134.857,307.751,142.305,307.751,157.467 L307.751,157.733 C307.751,171.831,319.455,177.995,332.755,177.995 C343.396,177.995,350.71,175.023,355.498,169.305 L355.498,177.95 L371.457,177.95 Z'
              }
            />
          </G>
          <Path
            fill={fill}
            d={'M382.85,107.726 L398.944,107.726 L398.944,177.95 L382.85,177.95 L382.85,107.726 Z'}
          />
          <Path
            fill={fill}
            d={
              'M456.577,152.547 C456.577,161.324,448.597,167.31,437.957,167.31 C430.376,167.31,424.391,163.586,424.391,156.936 L424.391,156.67 C424.391,149.487,430.376,145.364,440.485,145.364 C446.736,145.364,452.455,146.561,456.578,148.157 L456.578,152.547 Z M472.138,177.949 L472.138,136.32 C472.138,117.567,462.031,106.661,441.283,106.661 C429.845,106.661,422.263,109.056,414.55,112.514 L418.94,125.414 C425.324,122.755,431.175,121.025,439.023,121.025 C450.195,121.025,456.312,126.345,456.312,136.054 L456.312,137.783 C450.86,136.054,445.407,134.857,436.894,134.857 C420.536,134.857,408.432,142.305,408.432,157.467 L408.432,157.733 C408.432,171.831,420.136,177.995,433.437,177.995 C444.077,177.995,451.391,175.023,456.179,169.305 L456.179,177.95 L472.138,177.95 Z'
            }
          />
        </G>
      </Svg>
    </View>
  );
};

TupaiaLogo.propTypes = {
  style: ViewPropTypes.style,
  height: PropTypes.number,
  width: PropTypes.number,
  white: PropTypes.bool,
};

TupaiaLogo.defaultProps = {
  height: 23,
  width: 56,
  style: null,
  white: false,
};
