import React from 'react';
import {StyleSheet} from 'react-native';
import ProductItem from 'src/containers/ProductItem';
import ProductItemLoading from 'src/containers/ProductItem/Loading';

const List = ({data, loading, limit, width, height, navigationType}) => {
  const widthImage = 78;
  const heightImage = (widthImage * height) / width;

  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return listData.map(value => (
      <ProductItemLoading type="secondary" key={value} height={heightImage} />
    ));
  }

  return data.map((item, index) => (
    <ProductItem
      key={index}
      type="secondary"
      item={item}
      width={widthImage}
      height={heightImage}
      style={index === data.length - 1 && styles.itemFooter}
      navigationType={navigationType}
    />
  ));
};

const styles = StyleSheet.create({
  itemFooter: {
    borderBottomWidth: 0,
  },
});

List.defaultProps = {
  data: [],
  width: 204,
  height: 257,
  loading: 257,
  limit: 257,
};
export default List;
