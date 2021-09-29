import React from 'react';
import {ScrollView, View, Dimensions, Text} from 'react-native';
import ProductItem from 'src/containers/ProductItem';
import ProductItemLoading from 'src/containers/ProductItem/Loading';
import {padding} from 'src/components/config/spacing';

const WIDTH_SCREEN = Dimensions.get('window').width;

const Carousel = ({
  data,
  loading,
  limit,
  width,
  height,
  widthView,
  col,
  box,
  navigationType,
}) => {
  const separator = padding.base;
  const paddingEnd = box ? padding.large : 0;
  const column = col > 0 ? col : 1.5;
  const widthImage = widthView / column;
  const heightImage = (widthImage * height) / width;

  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {listData.map(value => (
          <View
            key={value}
            style={{
              marginLeft: separator / 2,
              marginRight:
                value === listData.length - 1
                  ? separator / 2 + paddingEnd
                  : separator / 2,
            }}>
            <ProductItemLoading width={widthImage} height={heightImage} />
          </View>
        ))}
      </ScrollView>
    );
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        marginHorizontal: -separator / 2,
      }}>
      {data.map((item, index) => (
        <View
          key={item.id}
          style={{
            marginLeft: separator / 2,
            marginRight:
              index === data.length - 1
                ? separator / 2 + paddingEnd
                : separator / 2,
          }}>
          <ProductItem
            item={item}
            width={widthImage}
            height={heightImage}
            navigationType={navigationType}
          />
        </View>
      ))}
    </ScrollView>
  );
};

Carousel.defaultProps = {
  data: [],
  width: 204,
  height: 257,
  widthView: WIDTH_SCREEN,
  col: 1.5,
  box: false,
  loading: true,
  limit: 4,
};
export default Carousel;
