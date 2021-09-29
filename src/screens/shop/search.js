import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {fromJS, Map} from 'immutable';
import pickBy from 'lodash/pickBy';
import queryString from 'query-string';
import {withTranslation} from 'react-i18next';
import fetch from 'src/utils/fetch';
import debounce from 'lodash/debounce';

import {SearchBar, ThemedView} from 'src/components';
import SearchRecentItem from './containers/SearchRecentItem';
import SearchProductItem from './containers/SearchProductItem';

import {
  languageSelector,
  currencySelector,
  defaultCurrencySelector,
} from 'src/modules/common/selectors';
import {mainStack} from 'src/config/navigator';
import {addKeyword} from 'src/modules/product/actions';
import {prepareProductItem} from 'src/utils/product';

import {getStatusBarHeight} from 'react-native-status-bar-height';

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data: [],
      loading: false,
    };
  }
  componentWillUnmount() {
    if (this?.abortController) {
      this.abortController.abort();
    }
  }
  search = debounce(() => {
    const {language} = this.props;
    const {search} = this.state;
    const query = Map({
      status: 'publish',
      orderby: 'popularity',
      lang: language,
      search,
    });

    if (query.get('search') && query.get('search').length > 1) {
      this.setState({
        loading: true,
      });
      const url = `/wc/v3/products?${queryString.stringify(
        pickBy(query.toJS(), item => item !== ''),
        {arrayFormat: 'comma'},
      )}`;
      // eslint-disable-next-line no-undef
      this.abortController = new AbortController();

      fetch
        .get(url, {
          signal: this.abortController.signal,
        })
        .then(data => {
          this.setState({
            data,
            loading: false,
          });
        })
        .catch(() => {
          this.setState({
            data: [],
            loading: false,
          });
        });
    }
  }, 200);

  searchSubmit = () => {
    const {navigation, dispatch} = this.props;
    const {search} = this.state;
    dispatch(addKeyword(search));
    navigation.navigate(mainStack.products, {
      name: search,
      filterBy: Map({search}),
    });
  };

  handleRecentKeyword = search => {
    const {navigation} = this.props;
    navigation.navigate(mainStack.products, {
      name: search,
      filterBy: Map({search}),
    });
  };

  handleProductPage = product => {
    const {navigation, currency, defaultCurrency} = this.props;
    navigation.navigate(mainStack.product, {
      // no need get days in prepareProductItem
      product: prepareProductItem(
        fromJS(product),
        currency,
        defaultCurrency,
      ).toJS(),
    });
  };

  render() {
    const {search, data, loading} = this.state;
    const {navigation, t} = this.props;

    return (
      <ThemedView isFullView style={styles.container}>
        <SearchBar
          placeholder={t('catalog:text_placeholder_search')}
          cancelButtonTitle={t('common:text_cancel')}
          onChangeText={value => this.setState({search: value})}
          value={search}
          onChange={this.search}
          autoFocus
          showLoading={loading}
          returnKeyType="search"
          onSubmitEditing={this.searchSubmit}
          onCancel={() => navigation.goBack()}
        />
        <ScrollView>
          {search.length > 0 ? (
            <SearchProductItem
              data={data}
              handleProductPage={this.handleProductPage}
            />
          ) : (
            <SearchRecentItem handleRecentKeyword={this.handleRecentKeyword} />
          )}
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
  },
});

const mapStateToProps = state => {
  return {
    language: languageSelector(state),
    currency: currencySelector(state),
    defaultCurrency: defaultCurrencySelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(SearchScreen));
