import React, {Component} from 'react';

import {compose} from 'recompose';
import {fromJS, List} from 'immutable';
import {connect} from 'react-redux';
import merge from 'lodash/merge';
import compact from 'lodash/compact';
import unescape from 'lodash/unescape';
import {withTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text, ListItem, ThemedView, ThemeConsumer} from 'src/components';
import Price from 'src/containers/Price';
import Container from 'src/containers/Container';
import Rating from 'src/containers/Rating';
import Empty from 'src/containers/Empty';
import {ItemVendor, ItemVendorLoading} from 'src/containers/vendor';
import TextHtml from 'src/containers/TextHtml';

import ScrollProductDetail from './product/ScrollProductDetail';
import RelatedProducts from './containers/RelatedProducts';
import ProductVariable from './product/ProductVariable';
import ProductExternal from './product/ProductExternal';
import ProductGrouped from './product/ProductGrouped';
import CategoryName from './product/CategoryName';
import ProductImages from './product/ProductImages';
import ProductStock from './product/ProductStock';
import FooterProduct from './product/FooterProduct';
import SelectSize from './product/SelectSize';

import {getVariations} from 'src/modules/product/service';
import {
  attributeSelector,
  dataRatingSelector,
} from 'src/modules/product/selectors';
import {
  defaultCurrencySelector,
  currencySelector,
  languageSelector,
  configsSelector,
} from 'src/modules/common/selectors';

import {prepareProductItem} from 'src/utils/product';
import {changeColor, changeSize} from 'src/utils/text-html';

import {getSingleData, defaultPropsData} from 'src/hoc/single-data';
import {withAddToCart} from 'src/hoc/hoc-add-to-card';
import {withLoading} from 'src/hoc/loading';

import {mainStack, homeTabs} from 'src/config/navigator';
import {margin} from 'src/components/config/spacing';
import * as productType from 'src/config/product';

import {handleError} from 'src/utils/error';
import {fetchProductAttributes, fetchRating} from 'src/modules/product/actions';
import {fetchVendorDetail} from 'src/modules/vendor/actions';
import {
  detailVendorSelector,
  isLoadingVendorSelector,
} from 'src/modules/vendor/selectors';

import Icon from 'react-native-vector-icons/Entypo';

const {height} = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.6;

class Product extends Component {
  constructor(props, context) {
    super(props, context);

    const {route, data, currency, defaultCurrency} = props;

    const product = route?.params?.product ?? {};
    // no need get days in prepareProductItem
    const dataPrepare = prepareProductItem(
      fromJS(data),
      currency,
      defaultCurrency,
    );
    const dataProduct = product && product.id ? fromJS(product) : dataPrepare;
    this.state = {
      product: dataProduct,
      images: dataProduct.get('images'),
      loadingVariation: dataProduct.get('type') === productType.VARIABLE, // Loading state fetch product variations
      quantity: 1,
      variations: List(),
      isAddToCart: false,
    };
  }

  componentDidMount() {
    const {dispatch, lang} = this.props;
    const {product} = this.state;

    const vendor_id =
      product.getIn(['store', 'vendor_id']) ??
      product.getIn(['store', 'id']) ??
      null;

    dispatch(fetchRating(product.get('id')));

    // Fetch attribute with product is variation
    if (product.get('type') === productType.VARIABLE) {
      dispatch(fetchProductAttributes({productId: product.get('id')}));
    }

    // Fetch variations
    if (product.get('type') === productType.VARIABLE) {
      // eslint-disable-next-line no-undef
      this.abortController = new AbortController();

      // Get variations
      getVariations(product.get('id'), lang, {
        signal: this.abortController.signal,
      })
        .then(data => {
          this.setState({
            variations: fromJS(compact(data)),
            loadingVariation: false,
          });
        })
        .catch(error => {
          handleError(error);
          this.setState({
            loadingVariation: false,
          });
          handleError(error);
        });
    }

    dispatch(fetchVendorDetail(vendor_id));
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  addToCart = () => {
    const {
      addCart,
      state: {variation},
      t,
    } = this.props;
    const {product} = this.state;
    if (product.get('type') === productType.VARIABLE) {
      const attributeProduct = product
        .get('attributes')
        .filter(attr => attr.get('variation'));
      if (!variation || attributeProduct.size !== variation.length) {
        showMessage({
          message: t('catalog:text_select_variation'),
          type: 'danger',
        });
      } else {
        addCart(product.get('id'), () => this.setState({isAddToCart: true}));
      }
    } else {
      addCart(product.get('id'), () => this.setState({isAddToCart: true}));
    }
  };

  images = () => {
    const {
      state: {variation_id},
    } = this.props;
    const {product, variations, images} = this.state;
    const variation = variations.find(v => v.get('id') === variation_id);

    if (
      product.get('type') === productType.VARIABLE &&
      variation &&
      variation.get('image')
    ) {
      let list = [];
      const image = variation.get('image');
      if (image) {
        list.push(image.toJS());
      }
      return fromJS(list);
    }
    return images;
  };

  showPrice = () => {
    const {
      currency,
      defaultCurrency,
      state: {variation_id},
    } = this.props;
    const {product, variations} = this.state;
    const variation = variations.find(v => v.get('id') === variation_id);
    let price_format = product.get('price_format').toJS();
    let type = product.get('type');
    let p = product;
    if (
      product.get('type') === productType.VARIABLE &&
      variation &&
      variation.get('id')
    ) {
      // no need get days in prepareProductItem
      const value = prepareProductItem(variation, currency, defaultCurrency);
      price_format = value.get('price_format').toJS();
      type = value.get('type');
      p = variation;
    }
    return (
      <View style={styles.viewPrice}>
        <Price
          price_format={price_format}
          type={type}
          h4
          isPercentSale
          // style={styles.viewPrice}
        />
      </View>
    );
  };

  showInfoType = () => {
    const {
      attribute,
      state: {variation},
      selectVariation,
      updateMetaVariation,
    } = this.props;
    const {product, variations, loadingVariation} = this.state;
    if (product.get('type') === productType.EXTERNAL) {
      return <ProductExternal product={product} />;
    }
    if (product.get('type') === productType.GROUPED) {
      return <ProductGrouped product={product} />;
    }
    if (product.get('type') === productType.VARIABLE) {
      return (
        <ProductVariable
          loading={attribute.get('loading') || loadingVariation}
          meta_data={fromJS(variation)}
          productVariations={variations}
          productAttributes={product.get('attributes')}
          selectVariation={selectVariation}
          updateMetaVariation={updateMetaVariation}
          attribute={attribute.get('data')}
        />
      );
    }
    return null;
  };

  render() {
    const {
      t,
      dataRating: {rating},
      navigation,
      configs,
      vendorDetail,
      loadingVendor,
      loading,
      state: {variation_id},
    } = this.props;

    const {product, isAddToCart, variations} = this.state;

    if (!product.get('id')) {
      return (
        <ThemedView isFullView>
          <Empty
            title={t('empty:text_title_product_detail')}
            subTitle={t('empty:text_subtitle_product_detail')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        </ThemedView>
      );
    }
    const images = this.images();
    const related_ids = product.get('related_ids').size
      ? product.get('related_ids').toJS()
      : [];

    const firstImage = images.first();
    const image =
      firstImage && firstImage.get('src') ? firstImage.get('src') : '';
    const stock_status = ['instock', 'onbackorder'];

    const variation = variations.find(v => v.get('id') === variation_id);
    const valueCheck = variation && variation.size > 0 ? variation : product;

    return (
      <ScrollProductDetail
        headerTitle={unescape(product.get('name'))}
        imageElement={
          <ProductImages
            images={images}
            product_id={product.get('id')}
            url={product.get('permalink')}
            name_product={product.get('name')}
            height={HEADER_MAX_HEIGHT}
          />
        }
        // footerElement={
        //   configs.get('toggleCheckout') &&
        //   valueCheck.get('purchasable') &&
        //   stock_status.includes(valueCheck.get('stock_status')) && (
        //     <FooterProduct
        //       isAddToCart={isAddToCart}
        //       onPressAddCart={this.addToCart}
        //       loading={loading}
        //       onPressViewCart={() => navigation.navigate(homeTabs.cart)}
        //     />
        //   )
        // }
        heightViewImage={HEADER_MAX_HEIGHT}>
        <Container style={styles.container}>
          <Text h2 medium style={styles.textName}>
            {unescape(product.get('name'))}
          </Text>
          {configs.get('toggleShortDescriptionProduct') &&
          product.get('short_description') ? (
            <View style={styles.viewDescription}>
              <ThemeConsumer>
                {({theme}) => (
                  <TextHtml
                    value={product.get('short_description')}
                    style={merge(
                      changeSize('h6'),
                      changeColor(theme.Text.third.color),
                    )}
                  />
                )}
              </ThemeConsumer>
            </View>
          ) : null}
          {this.showPrice()}
          <SelectSize />
          {configs.get('toggleCheckout') &&
            valueCheck.get('purchasable') &&
            stock_status.includes(valueCheck.get('stock_status')) && (
              <FooterProduct
                isAddToCart={isAddToCart}
                onPressAddCart={this.addToCart}
                loading={loading}
                onPressViewCart={() => navigation.navigate(homeTabs.cart)}
              />
            )}

          <View style={styles.viewCategoryRating}>
            {configs.get('toggleReviewProduct') ? (
              <TouchableOpacity
                style={styles.viewRating}
                onPress={() =>
                  this.props.navigation.navigate(mainStack.product_review, {
                    product_id: product.get('id'),
                    image: image,
                    name: product.get('name'),
                  })
                }></TouchableOpacity>
            ) : null}
          </View>

          <ListItem
            title={t('catalog:text_details')}
            onPress={() =>
              this.props.navigation.navigate(mainStack.product_description, {
                description: product.get('description'),
              })
            }
            leftElement={
              <Image
                style={{height: 30, width: 30}}
                resizeMode="contain"
                source={require('src/assets/images/three_dot.png')}
              />
            }
            small
            type="underline"
          />

          {product.get('attributes') && product.get('attributes').size ? (
            <ListItem
              title={t('catalog:text_shipping_returns')}
              onPress={() =>
                this.props.navigation.navigate(mainStack.product_attribute, {
                  attributes: product.get('attributes'),
                })
              }
              small
              leftElement={
                <Image
                  style={{height: 30, width: 30}}
                  resizeMode="contain"
                  source={require('src/assets/images/shiping_icon.png')}
                />
              }
              type="underline"
            />
          ) : null}

          {configs.get('toggleReviewProduct') ? (
            <ListItem
              title={t('catalog:text_reviews')}
              onPress={() =>
                this.props.navigation.navigate(mainStack.product_review, {
                  product_id: product.get('id'),
                  image: image,
                  name: product.get('name'),
                })
              }
              small
              leftElement={
                <Image
                  style={{height: 30, width: 30}}
                  resizeMode="contain"
                  source={require('src/assets/images/review_icon.png')}
                />
              }
              rightElement={
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Rating
                    size={12}
                    startingValue={rating}
                    color="black"
                    readonly
                  />
                  <Text style={styles.textRating}>
                    ({product.get('rating_count')}{' '}
                    {t('common:text_customer_reviews')})
                  </Text>
                </View>
              }
              type="underline"
            />
          ) : null}

          {loadingVendor ? (
            <ItemVendorLoading style={styles.vendor} />
          ) : vendorDetail && vendorDetail.size > 0 ? (
            <ItemVendor
              store={vendorDetail.toJS()}
              style={styles.vendor}
              onPress={() => navigation.navigate(mainStack.store_detail)}
            />
          ) : null}
        </Container>
        {related_ids.length ? (
          <View style={styles.viewRelated}>
            <RelatedProducts data={related_ids.join(',')} />
          </View>
        ) : null}
      </ScrollProductDetail>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: margin.large,
  },
  viewCategoryRating: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: margin.small / 2,
  },
  textCategory: {
    flex: 1,
    marginRight: margin.base,
  },
  viewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRating: {
    fontSize: 10,
    lineHeight: 15,
    marginLeft: margin.small / 2,
  },
  textName: {
    marginBottom: margin.small,
  },
  viewPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: margin.large,
    marginTop: margin.small,
  },
  textDescription: {
    marginBottom: margin.large,
  },
  viewStock: {
    marginTop: margin.large,
    marginBottom: margin.small + margin.big,
  },
  viewRelated: {
    marginBottom: margin.big,
  },
  viewFooter: {
    marginVertical: margin.big,
  },
  viewDescription: {
    // marginBottom: margin.large,
  },
  vendor: {
    marginTop: margin.big - 1,
  },
});

const mapStateToProps = state => {
  return {
    attribute: attributeSelector(state),
    dataRating: dataRatingSelector(state),
    currency: currencySelector(state),
    defaultCurrency: defaultCurrencySelector(state),
    lang: languageSelector(state),
    configs: configsSelector(state),
    vendorDetail: detailVendorSelector(state),
    loadingVendor: isLoadingVendorSelector(state),
  };
};

const withReduce = connect(mapStateToProps);

export default compose(
  withTranslation(),
  withReduce,
  defaultPropsData,
  getSingleData,
  withLoading,
  withAddToCart,
)(Product);
