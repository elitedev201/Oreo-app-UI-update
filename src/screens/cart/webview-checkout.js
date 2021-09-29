import React, {Component} from 'react';

import {withTranslation} from 'react-i18next';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {ThemedView, Header} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';

import {mainStack} from 'src/config/navigator';
import {connect} from 'react-redux';
import queryString from 'query-string';
import {URL} from 'react-native-url-polyfill';

import {
  currencySelector,
  languageSelector,
  themeSelector,
  defaultLanguageSelector,
} from 'src/modules/common/selectors';
import {tokenSelector} from 'src/modules/auth/selectors';
import {cartKeySelector} from 'src/modules/cart/selectors';
import {clearCart} from 'src/modules/cart/actions';

import {API} from 'src/config/api';

class WebviewCheckout extends Component {
  webview = null;
  request = null;

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      visible: false,
      canGoBack: false,
      canGoForward: false,
    };
  }

  setModalVisible = visible => {
    this.setState({
      visible,
    });
  };

  handleResponse = request => {
    const {url, canGoForward, canGoBack} = request;
    const {navigation, theme, dispatch, currency} = this.props;

    const parsed = queryString.parse(new URL(url).search);
    console.log(parsed);

    if (url.includes('/order-received/')) {
      navigation.replace(mainStack.webview_thank_you, {
        uri: `${url}&mobile=1&theme=${theme}&currency=${currency}`,
      });
    }

    if (url.includes('/order-pay/')) {
      navigation.replace(mainStack.webview_payment, {
        uri: `${url}&mobile=1&theme=${theme}&currency=${currency}`,
      });
    }

    // Cancel order
    if (parsed.cancel_order) {
      navigation.goBack();
    }

    if (!parsed.cancel_order && url.includes(`${API}/cart`)) {
      dispatch(clearCart());
      navigation.goBack();
    }

    this.setState({
      canGoBack,
      canGoForward,
    });
  };

  handleGoBack = () => {
    const {navigation} = this.props;
    const {canGoBack} = this.state;
    if (this.webview && canGoBack) {
      this.webview.goBack();
    } else {
      navigation.goBack();
    }
  };

  handleGoForward = () => {
    const {navigation} = this.props;
    const {canGoForward} = this.state;
    if (this.webview && canGoForward) {
      this.webview.goForward();
    } else {
      navigation.goForward();
    }
  };

  render() {
    const {loading, canGoForward} = this.state;
    const {currency, theme, language, defaultLanguage, cartKey, token, t} =
      this.props;
    let checkoutQuery = {
      mobile: 1,
      theme,
      token,
      'cart-key': cartKey,
      currency: currency,
    };

    // Change language on web
    if (language !== defaultLanguage) {
      checkoutQuery = Object.assign({}, {lang: language}, checkoutQuery);
    }

    const uri = `${API}/wp-json/mobile-builder/v1/auto-login?${queryString.stringify(
      checkoutQuery,
      {
        arrayFormat: 'comma',
      },
    )}`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return (
      <ThemedView isFullView>
        <Header
          centerComponent={<TextHeader title={t('common:text_checkout_web')} />}
          leftComponent={<IconHeader onPress={this.handleGoBack} />}
          rightComponent={
            canGoForward ? (
              <IconHeader name="chevron-right" onPress={this.handleGoForward} />
            ) : null
          }
        />
        <WebView
          source={{
            uri,
            headers,
          }}
          ref={ref => (this.webview = ref)}
          onNavigationStateChange={this.handleResponse}
          style={styles.webView}
          onLoadStart={() => this.setState({loading: false})}
        />
        {loading && (
          <View style={styles.viewLoading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

WebviewCheckout.propTypes = {};

const mapStateToProps = state => {
  return {
    currency: currencySelector(state),
    theme: themeSelector(state),
    language: languageSelector(state),
    defaultLanguage: defaultLanguageSelector(state),
    token: tokenSelector(state),
    cartKey: cartKeySelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(WebviewCheckout));
