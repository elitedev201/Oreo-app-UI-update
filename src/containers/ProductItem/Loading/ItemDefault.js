import * as React from 'react';
import {ThemedView} from 'src/components';
import {borderRadius} from 'src/components/config/spacing';

function ItemDefaultLoading(props) {
  const {width, height, style} = props;
  return (
    <ThemedView
      colorSecondary
      style={[
        {
          width: width,
          height: height + 90,
          borderRadius: borderRadius.base,
        },
        style && style,
      ]}
    />
  );
}

export default ItemDefaultLoading;
