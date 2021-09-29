import * as React from 'react';
import {ThemedView, ThemeConsumer} from 'src/components';
import {padding} from 'src/components/config/spacing';

function ItemSecondaryLoading(props) {
  const {height, style} = props;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <ThemedView
          colorSecondary
          style={[
            {
              height: height + 2 * padding.small,
              borderBottomWidth: 1,
              borderColor: theme.colors.border,
            },
            style && style,
          ]}
        />
      )}
    </ThemeConsumer>
  );
}

export default ItemSecondaryLoading;
