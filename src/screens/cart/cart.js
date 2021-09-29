import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import values from 'lodash/values';
import includes from 'lodash/includes';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  I18nManager,
  Alert,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {ThemedView, Header, Button, Loading} from 'src/components';
import {TextHeader} from 'src/containers/HeaderComponent';
import ButtonSwiper from 'src/containers/ButtonSwiper';
import Container from 'src/containers/Container';
import Empty from 'src/containers/Empty';
import CartTotal from './containers/CartTotal';
import CartItem from './containers/CartItem';
import Coupon from './containers/Coupon';

import {
  getCart,
  removeFromCart,
  updateQuantityCart,
} from 'src/modules/cart/actions';
import {
  cartSelector,
  cartTotalSelector,
  countItemSelector,
  loadingItemSelector,
  loadingRemoveItemSelector,
  loadingUpdateQuantitySelector,
} from 'src/modules/cart/selectors';
import {
  configsSelector,
  currencySelector,
  getSiteConfig,
} from 'src/modules/common/selectors';
import {addWishList, removeWishList} from 'src/modules/common/actions';
import {wishListSelector} from 'src/modules/common/selectors';
import {isLoginSelector} from 'src/modules/auth/selectors';

import {homeTabs, mainStack, authStack} from 'src/config/navigator';

import {margin} from 'src/components/config/spacing';

function CartScreen(props) {
  const {t} = useTranslation();
  const {
    data,
    totals,
    count,
    loading,
    loadingRemove,
    loadingUpdate,
    wishList,
    currency,
    configs,
    siteConfigs,
    isLogin,
    dispatch,
    navigation,
  } = props;
  React.useEffect(() => {
    dispatch(getCart());
  }, []);

  const subtitleHeader =
    count > 1
      ? t('common:text_items', {count})
      : t('common:text_item', {count});
  const lists =
    typeof data === 'object'
      ? values(data).filter(value => typeof value === 'object')
      : [];
  const widthButton = configs.toggleWishlist ? 140 : 70;
  const webviewCheckout = configs?.webviewCheckout ?? true;

  const getHandleWishList = productId => {
    const hasList = includes(wishList, productId);
    const wishListAction = hasList
      ? () => dispatch(removeWishList(productId))
      : () => dispatch(addWishList(productId));
    return {
      type: hasList ? 'like' : 'unlike',
      onPress: wishListAction,
    };
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) {
      notificationDeleteItem(key);
    } else {
      dispatch(
        updateQuantityCart({
          cart_item_key: key,
          quantity,
        }),
      );
    }
  };
  const notificationDeleteItem = key => {
    Alert.alert(
      'Delete item',
      'Do you want to delete item?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => dispatch(removeFromCart({cart_item_key: key})),
        },
      ],
      {cancelable: false},
    );
  };

  const goToProduct = productId =>
    navigation.navigate(mainStack.product, {id: productId, type: 'product'});

  return (
    <ThemedView isFullView>
      <Header
        centerComponent={
          <TextHeader title={t('common:text_cart')} subtitle={subtitleHeader} />
        }
      />
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <>
          {count < 1 ? (
            <Empty
              icon="shopping-bag"
              title={t('empty:text_title_cart')}
              subTitle={t('empty:text_subtitle_cart')}
              clickButton={() => navigation.navigate(homeTabs.shop)}
            />
          ) : (
            <>
              <CartTotal
                style={styles.viewTotal}
                totals={totals}
                currency={currency}
              />
              <SwipeListView
                useFlatList
                removeClippedSubviews={false}
                keyExtractor={item => item.key}
                data={lists}
                renderItem={({item, index}) => (
                  <CartItem
                    item={item}
                    currency={currency}
                    updateQuantity={
                      !loadingRemove || !loadingUpdate
                        ? updateQuantity
                        : () => {}
                    }
                    goToProduct={goToProduct}
                    style={index === 0 && styles.firstItem}
                  />
                )}
                leftOpenValue={widthButton}
                rightOpenValue={-widthButton}
                disableLeftSwipe={I18nManager.isRTL}
                disableRightSwipe={!I18nManager.isRTL}
                renderHiddenItem={({item}) => (
                  <View style={styles.viewButton}>
                    {configs.toggleWishlist ? (
                      <ButtonSwiper {...getHandleWishList(item.product_id)} />
                    ) : null}
                    <ButtonSwiper
                      onPress={() => notificationDeleteItem(item.key)}
                    />
                  </View>
                )}
                ListFooterComponent={
                  <Container>
                    <Coupon />
                  </Container>
                }
              />
              <Container style={styles.footerScrollview}>
                <Button
                  title={t('cart:text_go_checkout')}
                  onPress={() => {
                    if (
                      siteConfigs?.enable_guest_checkout === 'no' &&
                      !isLogin
                    ) {
                      navigation.navigate(authStack.login);
                    } else {
                      navigation.navigate(mainStack.webview_checkout);
                      // navigation.navigate(
                      //   webviewCheckout ? mainStack.webview_checkout : mainStack.checkout,
                      // );
                    }
                  }}
                />
              </Container>
            </>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginVertical: margin.base,
  },
  viewTotal: {
    marginBottom: margin.large - 2,
  },
  viewButton: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerScrollview: {
    marginVertical: margin.large,
  },
});

const mapStateToProps = state => ({
  count: countItemSelector(state),
  loading: loadingItemSelector(state),
  loadingRemove: loadingRemoveItemSelector(state),
  loadingUpdate: loadingUpdateQuantitySelector(state),
  data: cartSelector(state).toJS(),
  totals: cartTotalSelector(state).toJS(),
  configs: configsSelector(state).toJS(),
  siteConfigs: getSiteConfig(state).toJS(),
  wishList: wishListSelector(state).toJS(),
  currency: currencySelector(state),
  isLogin: isLoginSelector(state),
});

CartScreen.defaultProps = {};

export default connect(mapStateToProps, null)(CartScreen);
