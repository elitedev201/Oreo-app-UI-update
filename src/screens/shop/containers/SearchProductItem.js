import React from 'react';
import unescape from 'lodash/unescape';
import {StyleSheet} from 'react-native';
import {ListItem, withTheme} from 'src/components';
import Container from 'src/containers/Container';

import {grey3} from 'src/components/config/colors';

const SearchProductItem = props => {
  const {data, handleProductPage, theme} = props;

  return (
    <Container
      style={[
        styles.viewSearch,
        {
          borderColor: theme.colors.border,
        },
      ]}>
      {data.map(dataSearch => (
        <ListItem
          key={dataSearch.id}
          title={unescape(dataSearch.name)}
          type="underline"
          small
          leftIcon={{
            name: 'search',
            size: 16,
            color: grey3,
          }}
          onPress={() => handleProductPage(dataSearch)}
        />
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  viewSearch: {
    borderTopWidth: 1,
  },
});

SearchProductItem.defaultProps = {
  data: [],
  handleProductPage: () => {},
};

export default withTheme(SearchProductItem);
