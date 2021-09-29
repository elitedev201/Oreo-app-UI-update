import React from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'src/components';
import Heading from 'src/containers/Heading';
import Input from 'src/containers/input/Input';
import TextHtml from 'src/containers/TextHtml';

import {
  countrySelector,
  configsSelector,
  languageSelector,
} from 'src/modules/common/selectors';

import {mainStack} from 'src/config/navigator';

import {fromCharCode} from 'src/utils/string';

import {margin, padding} from 'src/components/config/spacing';
import fonts, {lineHeights} from 'src/components/config/fonts';

function PaymentForm(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {shipping, customerNote, onChangeNote, country, configs, language} =
    props;
  const countries = country.get('data');
  const findCountry = countries.find(
    c => c.get('code') === shipping.get('country'),
  );
  return (
    <View style={styles.container}>
      <Heading
        title={t('cart:text_delivery_address')}
        containerStyle={styles.headerText}
      />
      <Text medium style={styles.textName}>
        {shipping.get('first_name')} {shipping.get('last_name')}
      </Text>
      <Text colorThird style={styles.textBilling}>
        {shipping.get('address_1')}
      </Text>
      <Text colorThird style={styles.textBilling}>
        {shipping.get('city')}
      </Text>
      <Text colorThird style={styles.textBilling}>
        {shipping.get('postcode')}
      </Text>
      <Text colorThird style={styles.textBilling}>
        {shipping.get('postcode')}
      </Text>
      <Text colorThird style={styles.textBilling}>
        {shipping.get('postcode')}
      </Text>
      {findCountry && (
        <Text colorThird style={styles.textBilling}>
          {fromCharCode(findCountry.get('name'))}
        </Text>
      )}
      <Heading title={t('cart:text_note')} containerStyle={styles.headerText} />
      <Input
        label={t('inputs:text_note')}
        multiline
        value={customerNote}
        onChangeText={onChangeNote}
      />
      <TouchableOpacity
        style={styles.textDescription}
        onPress={() =>
          navigation.navigate(mainStack.page, {
            id: configs?.policy?.[language] ?? '',
            type: 'page',
          })
        }>
        <TextHtml
          value={t('cart:text_payment_privacy')}
          style={{
            b: fonts.medium,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: margin.big,
  },
  headerText: {
    paddingTop: 41,
    paddingBottom: padding.large,
  },
  textName: {
    marginBottom: margin.small,
  },
  textBilling: {
    lineHeight: lineHeights.h4 + 1,
  },
  textDescription: {
    marginTop: margin.big,
  },
  headerPrivacy: {
    paddingTop: 0,
    height: 56,
  },
});

const mapStateToProps = state => ({
  country: countrySelector(state),
  configs: configsSelector(state).toJS(),
  language: languageSelector(state),
});

export default connect(mapStateToProps)(PaymentForm);
