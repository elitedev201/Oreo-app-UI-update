import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text} from 'src/components';
import Container from 'src/containers/Container';
import currencyFormatter from 'src/utils/currency-formatter';

function CartTotal(props) {
  const {t} = useTranslation();
  const {totals, currency, style} = props;
  return (
    <Container style={[styles.container, style && style]}>
      <View style={styles.viewText}>
        <Text>{t('cart:text_total')}</Text>
      </View>
      <Text h3 medium>
        {currencyFormatter(totals?.subtotal, currency)}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    flex: 1,
  },
});

export default CartTotal;
