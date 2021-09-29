import React from 'react';

import {ScrollView, View} from 'react-native';
import ItemBlogRow from 'src/screens/blog/containers/ItemBlogRow';
import ItemBlogRowLoading from 'src/screens/blog/containers/ItemBlogRowLoading';

import {padding} from 'src/components/config/spacing';

const BlogRow = ({data, loading, limit, width, height, boxed, tz}) => {
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return (
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {listData.map(value => (
            <ItemBlogRowLoading
              key={value}
              width={width}
              height={height}
              style={{
                marginRight:
                  value !== data.length - 1
                    ? padding.small
                    : boxed
                    ? padding.large
                    : 0,
              }}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((blog, index) => (
          <ItemBlogRow
            tz={tz}
            key={index}
            item={blog}
            width={width}
            height={height}
            style={{
              marginRight:
                index !== data.length - 1
                  ? padding.small
                  : boxed
                  ? padding.large
                  : 0,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};
BlogRow.defaultProps = {
  data: [],
  width: 223,
  height: 183,
  boxed: false,
  loading: true,
  limit: 4,
};

export default BlogRow;
