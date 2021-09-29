// @flow
import React from 'react';
import {ViewPropTypes} from 'react-native';
import ItemDefault from './ItemDefaut';
import ItemSecondary from './ItemSecondary';

type Props = {
  type?: 'default' | 'secondary',
  style?: ViewPropTypes,
};

function ItemVendor(props: Props) {
  const {type, style} = props;

  if (type === 'secondary') {
    return <ItemSecondary style={style} />;
  }
  return <ItemDefault style={style} />;
}

export default ItemVendor;
