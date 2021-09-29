import * as React from 'react';
import {ThemedView} from 'src/components';
import {borderRadius} from 'src/components/config/spacing';

function ItemBlogRowLoading(props) {
  const {width, height, style} = props;
  return (
    <ThemedView
      colorSecondary
      style={[
        {
          width,
          height: height + 130,
          borderRadius: borderRadius.base,
        },
        style && style,
      ]}
    />
  );
}

export default ItemBlogRowLoading;
