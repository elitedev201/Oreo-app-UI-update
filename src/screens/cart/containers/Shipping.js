import * as React from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import omit from 'lodash/omit';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  ScrollView,
  View,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {Text, Button} from 'src/components';
import Container from 'src/containers/Container';
import {Row, Col} from 'src/containers/Gird';
import Heading from 'src/containers/Heading';
import ShippingForm from './ShippingForm';
import ShippingMethod from './ShippingMethod';

import {fetchCustomer} from 'src/modules/auth/actions';
import {userIdSelector, authSelector} from 'src/modules/auth/selectors';
import {
  updateAddress,
  changeChosenMethod,
  changeIsDifferentAddress,
} from 'src/modules/checkout/actions';
import {
  shippingSelector,
  billingSelector,
  shippingMethodsDataSelector,
  shippingMethodsLoadingSelector,
  chosenMethodsSelector,
  isDifferentAddressSelector,
} from 'src/modules/checkout/selectors';
import {validatorAddress} from 'src/modules/cart/validator';
import {billingAddressInit, shippingAddressInit} from 'src/modules/auth/config';

import {red} from 'src/components/config/colors';
import {padding, margin} from 'src/components/config/spacing';

function Shipping(props) {
  const {t} = useTranslation();
  const {
    backStep,
    nextStep,
    shipping,
    billing,
    isDifferentAddress,
    dataMethods,
    loadingMethod,
    chosenMethods,
    userId,
    auth,
    dispatch,
  } = props;
  const {pendingGetCustomer} = auth;
  const [errors, setErrors] = React.useState(fromJS({}));

  React.useEffect(() => {
    if (billing.equals(fromJS(billingAddressInit))) {
      dispatch(fetchCustomer(userId, saveAddress));
    }
  }, []);

  const saveAddress = customer => {
    let dataAddress = {
      billing: customer.billing,
    };
    if (
      !isDifferentAddressSelector ||
      shipping.equals(fromJS(shippingAddressInit))
    ) {
      dataAddress.shipping = omit(customer.billing, ['email', 'phone']);
    }
    dispatch(updateAddress(dataAddress));
  };

  const onChangeShippingMethod = (key, value) => {
    dispatch(changeChosenMethod(key, value));
  };

  const goNext = () => {
    // Validation
    let errors = {};
    let errorBilling = validatorAddress(billing, 'billing');
    if (errorBilling.size > 0) {
      errors.billing = errorBilling.toJS();
    }
    if (isDifferentAddress) {
      let errorShipping = validatorAddress(shipping);
      if (errorShipping.size > 0) {
        errors.shipping = errorShipping.toJS();
      }
    }
    if (chosenMethods.size < dataMethods.size) {
      errors.shipping_lines = t('cart:text_shipping_method_error');
    }
    if (errors.length > 0) {
      setErrors(fromJS(errors));
    } else {
      if (!isDifferentAddress) {
        const dataShipping = billing.deleteAll(['email', 'phone']);
        dispatch(updateAddress({shipping: dataShipping.toJS()}));
      }
      setErrors(fromJS({}));
      nextStep();
    }
  };
  if (pendingGetCustomer) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Heading
            title={t('cart:text_billing_detail')}
            containerStyle={styles.textTitle}
          />
          <ShippingForm
            errors={errors.get('billing')}
            data={billing}
            type="billing"
            onChange={(key, value) =>
              dispatch(updateAddress({billing: {[key]: value}}))
            }
          />
          <View style={styles.useAsBilling}>
            <Text style={styles.usAsBillingText} colorSecondary>
              {t('cart:text_different_address')}
            </Text>
            <Switch
              value={isDifferentAddress}
              onValueChange={value => dispatch(changeIsDifferentAddress(value))}
            />
          </View>
          {isDifferentAddress ? (
            <>
              <Heading
                title={t('cart:text_shipping_address')}
                containerStyle={styles.textTitle}
              />
              <ShippingForm
                errors={errors.get('shipping')}
                data={shipping}
                type="shipping"
                onChange={(key, value) =>
                  dispatch(updateAddress({shipping: {[key]: value}}))
                }
              />
            </>
          ) : null}
          {errors.get('shipping_lines') ? (
            <Text style={{color: red}}>{errors.get('shipping_lines')}</Text>
          ) : null}
          {loadingMethod ? (
            <View>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            dataMethods.map((method, index) => (
              <View key={index} style={styles.viewMethod}>
                <Heading
                  title={
                    method.getIn(['store', 'store_name'])
                      ? t('cart:text_shipping_store', {
                          name: method.getIn(['store', 'store_name']),
                        })
                      : t('cart:text_shipping')
                  }
                  containerStyle={[styles.textTitle, styles.textMethod]}
                />
                <ShippingMethod
                  method={method.toJS()}
                  selectMethods={chosenMethods}
                  onChangeShippingMethod={onChangeShippingMethod}
                />
              </View>
            ))
          )}
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
            <Button title={t('common:text_next')} onPress={goNext} />
          </Col>
        </Row>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  loading: {
    marginTop: margin.large + 4,
  },
  footer: {
    marginVertical: 26,
  },
  textTitle: {
    paddingTop: padding.base + 2,
    paddingBottom: padding.base,
  },
  textMethod: {
    paddingBottom: padding.small - 3,
  },
  viewMethod: {
    marginBottom: margin.base,
  },
  useAsBilling: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: margin.large,
    marginBottom: margin.small - 2,
  },
  usAsBillingText: {
    marginVertical: 3,
    flex: 1,
  },
});

const mapStateToProps = state => ({
  userId: userIdSelector(state),
  auth: authSelector(state),
  shipping: shippingSelector(state),
  billing: billingSelector(state),
  dataMethods: shippingMethodsDataSelector(state),
  isDifferentAddress: isDifferentAddressSelector(state),
  loadingMethod: shippingMethodsLoadingSelector(state),
  chosenMethods: chosenMethodsSelector(state),
});

export default connect(mapStateToProps, null)(Shipping);
