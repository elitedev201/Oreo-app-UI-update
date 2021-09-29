import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import {Text, withTheme} from 'src/components';

import {languageSelector} from 'src/modules/common/selectors';
import {padding} from 'src/components/config/spacing';

const TextInfo = ({fields, theme, language}) => {
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length < 1) {
    return null;
  }
  return (
    <View
      style={[
        {
          paddingVertical: padding.large + 3,
          paddingHorizontal: padding.large,
          backgroundColor: fields.bg_color
            ? fields.bg_color
            : theme.colors.bgColorSecondary,
        },
      ]}>
      {fields.title && fields.title.text && fields.title.text[language] ? (
        <Text
          medium
          style={[styles.text, fields.title.style && fields.title.style]}>
          {fields.title.text[language]}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
const mapStateToProps = state => ({
  language: languageSelector(state),
});

export default connect(mapStateToProps)(withTheme(TextInfo));
