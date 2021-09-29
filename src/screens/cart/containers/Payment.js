import * as React from 'react';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {fromJS} from 'immutable';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, ScrollView, FlatList, Dimensions} from 'react-native';
import WebView from 'react-native-webview';
import {Text, Button, Modal} from 'src/components';
import {Col, Row} from 'src/containers/Gird';
import Heading from 'src/containers/Heading';
import Container from 'src/containers/Container';
import PaymentMethod from './PaymentMethod';
import PaymentForm from './PaymentForm';
import OrderInfo from './OrderInfo';
import Gateways from '../gateways';

import {
  paymentGatewaysSelector,
  currencySelector,
} from 'src/modules/common/selectors';
import {cartTotalSelector, cartSelector} from 'src/modules/cart/selectors';
import {
  paymentMethodSelector,
  shippingSelector,
  customerNoteSelector,
  checkoutLoadingSelector,
  checkoutRedirectSelector,
} from 'src/modules/checkout/selectors';
import {
  selectPaymentMethod,
  changeCustomerNote,
  checkout,
} from 'src/modules/checkout/actions';

import {red} from 'src/components/config/colors';
import fonts from 'src/components/config/fonts';
import {padding, margin} from 'src/components/config/spacing';

const contents = {
  OrderInfo,
  Gateways,
};

const {width} = Dimensions.get('window');

const getHtml = (message, color) => {
  return `
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
            body {
                color: ${color};
                font-family: ${fonts.regular.fontFamily};
                padding-left: 16px;
                padding-right: 16px;
            }
            ul {
                padding-left: 10px;
            }
            li {
                margin-bottom: 6px;
            }
        </style>
    </head>
    <body>
        ${message}
    </body>
</html>
`;
};

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: fromJS({}),
      isModal: false,
      message: '',
    };
  }

  componentDidUpdate(prevProps, prevStates) {
    if (prevStates.isModal && !this.state.isModal) {
      this.updateMessage('');
    }
  }

  selectMethod = value => this?.props?.dispatch(selectPaymentMethod(value));

  goNext = () => {
    const {paymentMethod, t} = this.props;
    const errors = !paymentMethod
      ? {
          payment_method: t('cart:text_payment_method_error'),
        }
      : {};

    if (Object.keys(errors).length > 0) {
      this.setState({
        errors: fromJS(errors),
      });
    } else {
      this.setState({
        errors: fromJS({}),
        isModal: true,
      });
    }
  };
  /**
   * Handle payment step on Modal
   */
  handlePayment = () => {
    this?.flatListPayment?.scrollToEnd();
  };

  /**
   * Handle progress checkout with addition data
   * @param method
   * @param data
   */
  handlePaymentProgress = ({method, data}) => {
    const {dispatch, nextStep} = this.props;
    if (method === 'stripe') {
      this.setState({isModal: false});
      dispatch(checkout(() => nextStep(), {stripe_source: data}));
    }
  };

  /**
   * Next step on modal
   */
  handleNext = () => {
    this.setState({isModal: false});
  };

  updateMessage = value => {
    this.setState({
      message: value,
    });
  };

  /**
   * Handle call back checkout
   * @param data
   */
  callBack = data => {
    const {nextStep, payment_method} = this.props;
    if (data.result === 'success') {
      // Offline payments
      if (
        payment_method === 'cod' ||
        payment_method === 'bacs' ||
        payment_method === 'cheque'
      ) {
        // Next to success page
        this.setState({isModal: false});
        nextStep();
      } else {
        this.handlePayment();
      }
    } else {
      this.updateMessage(data.messages);
    }
  };

  /**
   * Progress checkout
   */
  processCheckout = () => {
    const {dispatch, paymentMethod} = this.props;
    console.log('paymentMethod', paymentMethod);
    if (paymentMethod === 'stripe') {
      this.handlePayment();
    } else {
      // Do with redirect payment method
      dispatch(checkout(this.callBack));
    }
  };

  /**
   * Render checkout step
   * @param item
   * @return {*}
   */
  renderCheckoutStep = ({item}) => {
    const {
      currency,
      paymentMethod,
      checkoutLoading,
      redirect,
      totals,
      dataCart,
    } = this.props;
    const ContentComponent = contents[item];

    return (
      <View style={styles.tabContent}>
        <ContentComponent
          selected={paymentMethod}
          checkoutLoading={checkoutLoading}
          redirect={redirect}
          processCheckout={this.processCheckout}
          currency={currency}
          totals={totals}
          cart={dataCart}
          nextStep={this.handleNext}
          handlePayment={this.handlePayment}
          handlePaymentProgress={this.handlePaymentProgress}
        />
      </View>
    );
  };

  render() {
    const {
      backStep,
      nextStep,
      shipping,
      customerNote,
      paymentGateway,
      paymentMethod,
      t,
      dispatch,
      totals,
    } = this.props;
    const {errors, isModal, message} = this.state;
    const html = getHtml(message, red);
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Container>
            <Heading
              title={t('cart:text_payment_method')}
              containerStyle={styles.headerText}
            />
            {errors.get('payment_method') ? (
              <Text style={{color: red}}>{errors.get('payment_method')}</Text>
            ) : null}
            <PaymentMethod
              nextStep={nextStep}
              lists={paymentGateway}
              selected={paymentMethod}
              selectMethod={this.selectMethod}
            />
            <PaymentForm
              shipping={shipping}
              customerNote={customerNote}
              onChangeNote={value => dispatch(changeCustomerNote(value))}
            />
          </Container>
        </ScrollView>
        <Container style={styles.footer}>
          <Row>
            <Col>
              <Button
                type="outline"
                title={t('common:text_back')}
                onPress={backStep}
              />
            </Col>
            <Col>
              <Button title={t('common:text_payment')} onPress={this.goNext} />
            </Col>
          </Row>
        </Container>
        <Modal
          visible={isModal}
          setModalVisible={value => this.setState({isModal: value})}
          ratioHeight={0.9}>
          {message ? (
            <WebView
              originWhitelist={['*']}
              source={{html}}
              style={styles.webView}
            />
          ) : (
            <FlatList
              data={['OrderInfo', 'Gateways']}
              horizontal
              pagingEnabled
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              ref={ref => {
                this.flatListPayment = ref;
              }}
              keyExtractor={item => item}
              renderItem={this.renderCheckoutStep}
            />
          )}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  headerText: {
    paddingTop: padding.large,
    paddingBottom: 4,
  },
  footer: {
    marginVertical: margin.big,
  },
  webView: {
    backgroundColor: 'transparent',
  },
  tabContent: {
    width: width,
  },
});

const mapStateToProps = state => ({
  shipping: shippingSelector(state),
  paymentGateway: paymentGatewaysSelector(state),
  paymentMethod: paymentMethodSelector(state),
  customerNote: customerNoteSelector(state),
  checkoutLoading: checkoutLoadingSelector(state),
  redirect: checkoutRedirectSelector(state),
  currency: currencySelector(state),
  dataCart: cartSelector(state).toJS(),
  totals: cartTotalSelector(state).toJS(),
});

export default connect(mapStateToProps, null)(withTranslation()(Payment));
