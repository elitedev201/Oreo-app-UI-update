import React from 'react';
import {useTranslation} from 'react-i18next';
import Container from 'src/containers/Container';
import {Row, Col} from 'src/containers/Gird';
import {
  View,
  Text
} from 'react-native';
import Button from 'src/containers/Button';

import {margin} from 'src/components/config/spacing';

const FooterProduct = ({
  isAddToCart,
  loading,
  onPressAddCart,
  onPressViewCart,
}) => {
  const {t} = useTranslation();

  return (
    <View style={{marginBottom: margin.big, marginTop: margin.large}}>
      <Row>
        <Col>
          <Button
            title={t('common:text_add_cart')}
            onPress={onPressAddCart}
            loading={loading}
          />
        </Col>
        {isAddToCart && (
          <Col>
            <Button
              title={t('common:text_view_cart')}
              onPress={onPressViewCart}
            />
          </Col>
        )}
      </Row>
    </View>
  );
};

FooterProduct.defaultProps = {
  isAddToCart: false,
  onPressAddCart: () => {},
  onPressViewCart: () => {},
};

export default FooterProduct;
