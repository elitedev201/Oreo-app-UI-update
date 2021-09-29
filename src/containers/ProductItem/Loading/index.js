// @flow
import React from 'react';
import ItemDefault from './ItemDefault';
import ItemSecondary from './ItemSecondary';

type Props = {
  type: 'default' | 'secondary' | 'cart' | 'order',
};
const ProductItemLoading = (props: Props) => {
  const {type, ...rest} = props;
  // if (!item || !item.id) {
  //   return null;
  // }
  // if (type === 'wishlist') {
  //   return <ItemWishlist item={item} {...rest} />;
  // } else if (type === 'cart') {
  //   return <ItemCart item={item} {...rest} />;
  // } else if (type === 'order') {
  //   return <ItemOrder item={item} {...rest} />;
  // }
  if (type === 'secondary') {
    return <ItemSecondary {...rest} />;
  }

  return <ItemDefault {...rest} />;
};

ProductItemLoading.defaultProps = {
  type: 'default',
};

export default ProductItemLoading;
