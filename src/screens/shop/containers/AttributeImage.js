// @flow
import * as React from 'react';
import {Image, StyleSheet} from 'react-native';

type Props = {
  image: string,
};

const AttributeImage = (props: Props) => (
  <Image style={styles.image} source={{uri: props.image}} />
);

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
});

export default AttributeImage;
