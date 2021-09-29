import React from 'react';
import {connect} from 'react-redux';
import concat from 'lodash/concat';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import compact from 'lodash/compact';
import unescape from 'lodash/unescape';
import {withTranslation} from 'react-i18next';
import {Map, fromJS} from 'immutable';

import {View, StyleSheet} from 'react-native';

import {Header, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import {TextHeader, IconHeader, CartIcon} from 'src/containers/HeaderComponent';
import Loading from 'src/containers/Loading/LoadingDefault';
import Empty from 'src/containers/Empty';

import Refine from './containers/Refine';
import SwitchProduct from './containers/SwitchProduct';
import ProductView from './containers/ProductView';
import CategoryList from './product/CategoryList';

import {sortBySelector, filterBySelector} from 'src/modules/product/selectors';
import {languageSelector} from 'src/modules/common/selectors';

import {
  clearFilter,
  fetchProducts as clearData,
} from 'src/modules/product/actions';
import {getProducts} from 'src/modules/product/service';

import {margin} from 'src/components/config/spacing';
import {mainStack, homeTabs} from 'src/config/navigator';
import {categorySelector} from 'src/modules/category/selectors';

const findCategory = (categoryId = '', lists = []) => {
  if (!categoryId || !lists || lists.length < 1) {
    return null;
  }
  var loopWhile = true;

  var category = null;
  var listFlat = lists;

  while (loopWhile && listFlat.length > 0) {
    const categoryFind = find(listFlat, c => c.id === parseInt(categoryId, 10));
    if (categoryFind) {
      category = categoryFind;
      loopWhile = false;
    } else {
      listFlat = compact(flatMap(listFlat, ca => ca.categories));
    }
  }
  return category;
};

class ProductsScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {t, route, categories} = props;

    const categoryId = route?.params?.id ?? '';
    const category = findCategory(categoryId, categories);
    const name =
      route?.params?.name ?? category?.name ?? t('common:text_product');

    this.state = {
      category,
      name,
      loading: true,
      refreshing: false,
      loadingMore: false,
      data: [],
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    const {route} = this.props;

    const sort = route?.params?.sortBy ?? Map();
    const filter = route?.params?.filterBy ?? Map();

    const prevSort = prevProps?.route?.params?.sortBy ?? Map();
    const prevFilter = prevProps?.route?.params?.filterBy ?? Map();

    if (!sort.equals(prevSort) || !filter.equals(prevFilter)) {
      this.fetchProducts(1);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearData([]));
    this.props.dispatch(clearFilter());
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  getData = page => {
    const {sortBy, filterBy, lang, route} = this.props;
    const {category} = this.state;

    const query = Map({
      status: 'publish',
      lang: lang,
      per_page: 4,
      page: page,
    })
      .merge(sortBy.get('query'))
      .merge(filterBy)
      .merge(route?.params?.filterBy ?? Map())
      .set(
        'category',
        filterBy.get('category')
          ? filterBy.get('category')
          : category && category.id
          ? category.id
          : '',
      );

    // eslint-disable-next-line no-undef
    this.abortController = new AbortController();

    return getProducts(query.toJS(), {
      signal: this.abortController.signal,
    });
  };

  fetchProducts = async (page = this.state.page) => {
    try {
      const dataGet = await this.getData(page);

      if (dataGet.length <= 4 && dataGet.length > 0) {
        this.setState(preState => {
          return {
            loading: false,
            refreshing: false,
            loadingMore: dataGet.length === 4,
            data: page === 1 ? dataGet : concat(preState.data, dataGet),
          };
        });
      } else {
        this.setState(preState => {
          return {
            loadingMore: false,
            loading: false,
            refreshing: false,
            data: page === 1 ? [] : preState.data,
          };
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };

  handleCategoryPress = (id, name) => {
    this.props.navigation.push(mainStack.products, {
      id: id,
      name: unescape(name),
    });
  };

  handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        prevState => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchProducts();
        },
      );
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchProducts();
      },
    );
  };

  onClickRefine = () => {
    const {navigation} = this.props;
    const {category, data, loading} = this.state;
    if (!loading) {
      navigation.navigate(mainStack.refine, {
        category: category,
        data,
      });
    }
  };

  render() {
    const {navigation, t} = this.props;
    const {category, name, data, loading, loadingMore, refreshing} = this.state;

    // const subsCategory = categories.filter(cat => cat.parent === category);
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={unescape(name)} />}
          rightComponent={<CartIcon />}
        />
        {loading || (!loading && data.length) ? (
          <View style={styles.viewList}>
            <Container style={styles.viewRefineSwitch}>
              <Refine onPress={this.onClickRefine} />
              <SwitchProduct loading={loading} />
            </Container>
            <CategoryList
              onPress={this.handleCategoryPress}
              data={
                category && category.categories ? category.categories : null
              }
            />
            <ProductView
              data={fromJS(data)}
              loading={loading}
              loadingMore={loadingMore}
              refreshing={refreshing}
              handleLoadMore={this.handleLoadMore}
              handleRefresh={this.handleRefresh}
            />
          </View>
        ) : (
          <Empty
            icon="box"
            title={t('empty:text_title_product')}
            subTitle={t('empty:text_subtitle_product')}
            titleButton={t('common:text_go_shopping')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewRefineSwitch: {
    marginTop: margin.base,
    marginBottom: margin.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewList: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  const {data} = categorySelector(state);
  return {
    sortBy: sortBySelector(state),
    filterBy: filterBySelector(state),
    lang: languageSelector(state),
    categories: data,
  };
};

export default connect(mapStateToProps)(withTranslation()(ProductsScreen));
