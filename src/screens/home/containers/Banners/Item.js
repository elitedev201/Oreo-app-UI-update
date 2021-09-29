import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from 'src/components';

const ImageBanner = ({radius, clickBanner, contentContainerStyle, ...rest}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        radius && {borderRadius: radius},
        contentContainerStyle && contentContainerStyle,
      ]}
      activeOpacity={clickBanner ? 0.2 : 1}
      onPress={clickBanner ? clickBanner : () => {}}>
      <Image resizeMode="stretch" {...rest} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
export default ImageBanner;
