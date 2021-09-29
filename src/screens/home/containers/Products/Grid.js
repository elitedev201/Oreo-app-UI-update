import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import ProductItem from 'src/containers/ProductItem';
import ProductItemLoading from 'src/containers/ProductItem/Loading';

import {isLineEndColumn} from 'src/utils/func';
import {margin, padding} from 'src/components/config/spacing';
const WIDTH_SCREEN = Dimensions.get('window').width;

const Grid = ({
  data,
  loading,
  limit,
  width,
  height,
  widthView,
  col,
  navigationType,
}) => {
  const separator = padding.small;
  const column = col > 0 ? col : 1;
  const paddingSeparator = separator * (column - 1);
  const widthImage = (widthView - paddingSeparator) / column;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <View
        style={[
          styles.container,
          {
            marginHorizontal: -separator / 2,
          },
        ]}>
        {listData.map(value => (
          <View
            key={value}
            style={[
              {
                marginLeft: separator / 2,
                marginRight: separator / 2,
              },
              !isLineEndColumn(value, listData.length, column) && {
                marginBottom: margin.small + margin.big,
              },
            ]}>
            <ProductItemLoading width={widthImage} height={heightImage} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: -separator / 2,
        },
      ]}>
      {data.map((item, index) => (
        <View
          key={item.id}
          style={[
            {
              marginLeft: separator / 2,
              marginRight: separator / 2,
            },
            !isLineEndColumn(index, data.length, column) && {
              marginBottom: margin.small + margin.big,
            },
          ]}>
          <ProductItem
            item={item}
            width={widthImage}
            height={heightImage}
            navigationType={navigationType}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

Grid.defaultProps = {
  data: [],
  width: 204,
  height: 257,
  widthView: WIDTH_SCREEN,
  col: 1,
  loading: true,
  limit: 4,
};
export default Grid;
