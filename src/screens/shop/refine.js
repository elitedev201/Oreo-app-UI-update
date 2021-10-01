import React from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import {withTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {Text, ListItem} from 'src/components';
import Container from 'src/containers/Container';
import RadioIcon from './containers/RadioIcon';
import ViewRefine from './containers/ViewRefine';

import {mainStack} from 'src/config/navigator';

import {sortBySelector, attributeSelector} from 'src/modules/product/selectors';
import {
  sortByProduct,
  fetchProductAttributes,
  clearFilter,
  fetchProducts,
} from 'src/modules/product/actions';

import {margin} from 'src/components/config/spacing';

class RefineScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props, context) {
    super(props, context);
    const {t} = props;

    this.state = {
      sortBy: fromJS([
        {
          key: 'popularity',
          title: t('catalog:text_sort_popular'),
          query: {orderby: 'popularity'},
        },
        {
          key: 'rating',
          title: t('catalog:text_sort_rating'),
          query: {orderby: 'rating'},
        },
        {
          key: 'date',
          title: t('catalog:text_latest'),
          query: {},
        },
        {
          key: 'price',
          title: t('catalog:text_sort_price_low'),
          query: {order: 'asc', orderby: 'price'},
        },
        {
          key: 'price-desc',
          title: t('catalog:text_sort_price_high'),
          query: {order: 'desc', orderby: 'price'},
        },
      ]),
      old: this.props.sortBy,
    };
  }

  componentDidMount() {
    const {handleFetchProductAttributes} = this.props;
    handleFetchProductAttributes({productId: 0});
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount Refine');
    // TOTO: clear filter by
  }

  /**
   * Render sort by item
   * @param item
   * @returns {*}
   */
  renderSortBy = item => {
    const {sortBy, handleSortByProduct} = this.props;
    const isSelect = sortBy.get('key') === item.get('key');

    return (
      <ListItem
        key={item.get('key')}
        title={item.get('title')}
        type="underline"
        small
        rightIcon={<RadioIcon isSelect={isSelect} />}
        containerStyle={styles.item}
        onPress={() => handleSortByProduct(item)}
      />
    );
  };

  /**
   * Render attributes item
   * @param item
   * @returns {*}
   */
  renderAttribute = item => {
    const {navigation} = this.props;

    return (
      <ListItem
        key={item.get('id')}
        title={item.get('name')}
        type="underline"
        small
        chevron
        onPress={() =>
          navigation.navigate(mainStack.filter_attribute, {
            attribute: item,
          })
        }
      />
    );
  };

  showResult = () => {
    const {navigation, sortBy} = this.props;
    navigation.navigate(mainStack.products, {sortBy});
  };

  clearAll = () => {
    this.props.clearFilter();
  };

  goFilterPrice = () => {
    const {navigation, route, handleFetchProducts} = this.props;
    const data = route?.params?.data ?? [];
    handleFetchProducts(data);
    navigation.navigate(mainStack.filter_price);
  };

  render() {
    const {navigation, route, attribute, t} = this.props;
    const {sortBy} = this.state;
    const category = route?.params?.category ?? {};

    return (
      <ViewRefine handleResult={this.showResult} clearAll={this.clearAll}>
        <Container>
          <Text h3 medium style={styles.textSort}>
            {t('catalog:text_sort')}
          </Text>

          {sortBy.map(item => this.renderSortBy(item))}

          <Text h3 medium style={styles.textFilter}>
            {t('catalog:text_filter')}
          </Text>

          {category ? (
            <ListItem
              title={t('catalog:text_category')}
              type="underline"
              small
              chevron
              onPress={() =>
                navigation.navigate(mainStack.filter_category, {category})
              }
            />
          ) : null}

          <ListItem
            title={t('catalog:text_price_range')}
            type="underline"
            small
            chevron
            onPress={this.goFilterPrice}
          />

          {attribute.get('data').map(item => this.renderAttribute(item))}
        </Container>
      </ViewRefine>
    );
  }
}

const styles = StyleSheet.create({
  textSort: {
    marginTop: margin.large,
  },
  textFilter: {
    marginTop: margin.big + margin.small,
  },
});

const mapDispatchToProps = {
  clearFilter,
  handleFetchProducts: fetchProducts,
  handleSortByProduct: sortByProduct,
  handleFetchProductAttributes: fetchProductAttributes,
};

const mapStateToProps = state => {
  return {
    sortBy: sortBySelector(state),
    attribute: attributeSelector(state),
  };
};

RefineScreen.defaultProps = {
  data: [],
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(RefineScreen));
