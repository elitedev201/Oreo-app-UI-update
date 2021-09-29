import React from 'react';
import {compose} from 'redux';
import {fromJS, List, Map} from 'immutable';
import {connect} from 'react-redux';
import concat from 'lodash/concat';
import unescape from 'lodash/unescape';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, ActivityIndicator, Linking} from 'react-native';
import {ThemedView, Button, Text, ThemeConsumer} from 'src/components';
import Price from 'src/containers/Price';
import Quantity from 'src/containers/Quantity';

import {addListToCart} from 'src/modules/cart/actions';
import {loadingListSelector} from 'src/modules/cart/selectors';
import {getProducts} from 'src/modules/product/service';
import {
  configsSelector,
  currencySelector,
  defaultCurrencySelector,
} from 'src/modules/common/selectors';

import {handleError} from 'src/utils/error';

import * as productTypes from 'src/config/product';
import {prepareProductItem} from 'src/utils/product';
import {mainStack} from 'src/config/navigator';
import {padding, borderRadius} from 'src/components/config/spacing';
import {checkQuantity} from 'src/utils/product';
import {showMessage} from 'react-native-flash-message';

class ProductGrouped extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: fromJS([]),
      loading: true,
      dataAdd: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    try {
      const {product, currency, defaultCurrency} = this.props;
      let {data, dataAdd} = this.state;
      if (!product || !product.get('id')) {
        this.setState({
          loading: false,
        });
      }
      const query = {
        include: product.get('grouped_products').toJS(),
        status: 'publish',
      };
      const dataCategory = await getProducts(query);
      const dataPrepare = fromJS(dataCategory);

      dataPrepare.map(p => {
        // no need get days in prepareProductItem
        const prepareData = prepareProductItem(p, currency, defaultCurrency);
        data = data.push(prepareData);
        if (
          p.get('type') === productTypes.SIMPLE &&
          p.get('purchasable') &&
          p.get('stock_status') !== 'outofstock'
        ) {
          dataAdd = concat(dataAdd, {
            product_id: p.get('id'),
            quantity: 0,
          });
        }
      });
      this.setState({
        data,
        dataAdd,
        loading: false,
      });
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };
  goProductDetail = product => {
    this.props.navigation.push(mainStack.product, {
      product: product.toJS(),
    });
  };
  addToCart = () => {
    const {t, dispatch} = this.props;
    const {dataAdd} = this.state;
    const dataQuantity = dataAdd.filter(value => value.quantity > 0);
    if (dataQuantity.length < 1) {
      handleError({
        message: t('catalog:text_choose_cart'),
      });
    } else {
      dispatch(addListToCart(dataQuantity));
    }
  };
  changeQuantity = (id, value) => {
    if (value >= 0) {
      const {data} = this.state;
      let {dataAdd} = this.state;
      const getProduct = data.find(p => p.get('id') === id);
      const check = checkQuantity(getProduct.toJS(), value);
      if (check) {
        const findIndex = dataAdd.findIndex(value => value.product_id === id);
        dataAdd[findIndex] = {
          product_id: id,
          quantity: value,
        };
        this.setState({
          dataAdd,
        });
      } else {
        showMessage({
          message: "Can't change quantity",
          description: 'The quantity out of stock on store.',
          type: 'danger',
        });
      }
    }
  };
  showButtonAdd = (item, theme) => {
    const {t} = this.props;
    const {dataAdd} = this.state;
    const {ProductGrouped: colors} = theme;
    if (item.get('stock_status') === 'outofstock') {
      return (
        <Button
          title={t('common:text_read_more')}
          size={'small'}
          onPress={() => this.goProductDetail(item)}
        />
      );
    }
    if (item.get('type') === productTypes.EXTERNAL) {
      return (
        <Button
          title={item.get('button_text')}
          size={'small'}
          onPress={() => Linking.openURL(item.get('external_url'))}
        />
      );
    }
    if (
      item.get('type') === productTypes.VARIABLE ||
      item.get('type') === productTypes.GROUPED
    ) {
      return (
        <Button
          title={t('common:text_choose_item')}
          size={'small'}
          onPress={() => this.goProductDetail(item)}
        />
      );
    }
    const quantity =
      dataAdd.find(data => data.product_id === item.get('id'))?.quantity ?? 0;
    return (
      <Quantity
        value={quantity}
        onChange={value => this.changeQuantity(item.get('id'), value)}
        style={{backgroundColor: colors.quantityColor}}
      />
    );
  };
  render() {
    const {t, configs, loadingList} = this.props;
    const {data, dataAdd, loading} = this.state;
    if (loading) {
      return <ActivityIndicator />;
    }
    if (data.size < 1) {
      return null;
    }
    return (
      <View>
        <ThemeConsumer>
          {({theme}) => (
            <ThemedView colorSecondary style={styles.container}>
              {data.map((p, index) => (
                <View
                  key={p.get('id')}
                  style={[
                    styles.item,
                    {
                      borderColor: theme.colors.border,
                    },
                    index === data.size - 1 && styles.itemFooter,
                  ]}>
                  <View style={styles.viewLeft}>
                    {this.showButtonAdd(p, theme)}
                  </View>
                  <Text
                    style={styles.viewCenter}
                    colorSecondary
                    onPress={() => this.goProductDetail(p)}>
                    {unescape(p.get('name'))}
                  </Text>
                  <View style={styles.viewRight}>
                    <Price
                      price_format={p.get('price_format').toJS()}
                      style={styles.price}
                    />
                  </View>
                </View>
              ))}
            </ThemedView>
          )}
        </ThemeConsumer>
        {configs.get('toggleCheckout') && dataAdd.length > 0 && (
          <Button
            title={t('common:text_add_cart')}
            containerStyle={styles.button}
            loading={loadingList}
            onPress={() => this.addToCart()}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.large,
    paddingRight: 0,
    borderBottomWidth: 1,
  },
  itemFooter: {
    borderBottomWidth: 0,
  },
  viewLeft: {
    width: 86,
  },
  viewCenter: {
    flex: 1,
    paddingHorizontal: padding.large,
  },
  button: {
    marginTop: 26,
  },
  viewRight: {
    width: 60,
  },
  price: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});

const mapStateToProps = state => {
  return {
    configs: configsSelector(state),
    currency: currencySelector(state),
    defaultCurrency: defaultCurrencySelector(state),
    loadingList: loadingListSelector(state),
  };
};
const ProductGroupedComponent = connect(mapStateToProps)(ProductGrouped);

export default function (props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  return <ProductGroupedComponent navigation={navigation} t={t} {...props} />;
}
