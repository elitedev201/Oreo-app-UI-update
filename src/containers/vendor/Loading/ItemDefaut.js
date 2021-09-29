// @flow
import * as React from 'react';
import {ViewPropTypes} from 'react-native';
import {ThemedView} from 'src/components';
import {borderRadius} from 'src/components/config/spacing';

type Props = {
  style?: ViewPropTypes,
};

function ItemDefault(props: Props) {
  const {style} = props;
  return (
    <ThemedView
      colorSecondary
      style={[
        {
          height: 120,
          borderRadius: borderRadius.large,
        },
        style && style,
      ]}
    />
  );
}

export default ItemDefault;
