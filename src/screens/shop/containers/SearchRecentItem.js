import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {StyleSheet} from 'react-native';
import {ListItem, Text, withTheme} from 'src/components';
import Container from 'src/containers/Container';

import {recentSearch} from 'src/modules/product/selectors';

import {margin} from 'src/components/config/spacing';

const SearchRecentItem = props => {
  const {recent, handleRecentKeyword, theme} = props;
  const {t} = useTranslation();

  return (
    <Container>
      <Text h3 medium style={styles.textTitle}>
        {t('catalog:text_recent_search')}
      </Text>
      {recent.map(data => (
        <ListItem
          key={data}
          title={data}
          titleProps={{
            colorThird: true,
          }}
          small
          type="underline"
          leftIcon={{
            name: 'clock',
            size: 16,
            color: theme.Text.third.color,
          }}
          onPress={() => handleRecentKeyword(data)}
        />
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    marginTop: margin.small,
  },
});

SearchRecentItem.defaultProps = {
  handleRecentKeyword: () => {},
};

const mapStateToProps = state => {
  return {
    recent: recentSearch(state),
  };
};

export default connect(mapStateToProps)(withTheme(SearchRecentItem));
