// @flow
import React from 'react';
import {ViewPropTypes} from 'react-native';
import ItemVendorDefault from './ItemVendorDefault';
import ItemVendorSecondary from './ItemVendorSecondary';

type Props = {
  type?: 'default' | 'secondary',
  store?: any,
  style?: ViewPropTypes,
  onPress?: () => void,
};

function ItemVendor(props: Props) {
  const {type, store, style, onPress} = props;

  if (!store) {
    return null;
  }

  if (type === 'secondary') {
    return (
      <ItemVendorSecondary store={store} style={style} onPress={onPress} />
    );
  }
  return <ItemVendorDefault store={store} style={style} onPress={onPress} />;
}

export default ItemVendor;
