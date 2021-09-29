import React from 'react';

import ItemBlog from 'src/screens/blog/containers/ItemBlog';
import ItemBlogLoading from 'src/screens/blog/containers/ItemBlogLoading';

import {padding} from 'src/components/config/spacing';

const BlogColumn = ({data, loading, limit, width, height}) => {
  const widthImage = 137;
  const heightImage = (widthImage * height) / width;
  if (loading) {
    const listData = Array.from(Array(limit)).map((arg, index) => index);
    return listData.map(value => (
      <ItemBlogLoading key={value} height={height} />
    ));
  }
  return data.map((blog, index) => (
    <ItemBlog
      key={index}
      item={blog}
      width={widthImage}
      height={heightImage}
      style={index > 0 && {paddingTop: padding.big}}
    />
  ));
};

BlogColumn.defaultProps = {
  data: [],
  width: 137,
  height: 123,
  loading: true,
  limit: 4,
};

export default BlogColumn;
