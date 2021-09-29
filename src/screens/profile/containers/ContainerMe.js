import React from 'react';
import {View, StyleSheet} from 'react-native';
import {withTheme} from 'src/components';

const ContainerMe = function ({theme, children}) {
  return (
    <View style={[styles.view, {backgroundColor: theme.colors.bgColorPrimary}]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default withTheme(ContainerMe);
