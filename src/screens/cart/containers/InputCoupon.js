import * as React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {useTranslation, withTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Text, ThemeConsumer, withTheme} from 'src/components';
import Input from 'src/containers/input/InputBasic';
import {MIN_HEIGHT} from 'src/containers/ViewLabel';

import {addCoupon} from 'src/modules/cart/actions';
import {couponsAddLoadingSelector} from 'src/modules/cart/selectors';
import {listImageSelector} from 'src/modules/common/selectors';
import {margin, padding, borderRadius} from 'src/components/config/spacing';

function InputCoupon(props) {
  const {t} = useTranslation();
  const {images, addCouponLoading, dispatch} = props;
  const [value, setValue] = React.useState('');

  const clickApply = () => {
    if (value.length >= 4) {
      dispatch(addCoupon(value, () => setValue('')));
    }
  };
  const couponTrue = value.length > 3;
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.border,
              borderColor: theme.colors.border,
            },
          ]}>
          <View
            style={[styles.viewInput, {backgroundColor: theme.colors.bgColor}]}>
            <Image
              source={images?.coupon}
              resizeMode="stretch"
              style={styles.image}
            />
            <Input
              value={value}
              onChangeText={text => setValue(text)}
              style={[styles.input, {color: theme.colors.primary}]}
              placeholder={t('cart:text_coupon_input')}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.viewButton,
              {
                backgroundColor: theme.colors.bgColor,
              },
            ]}
            onPress={clickApply}
            activeOpacity={couponTrue ? 0.8 : 1}>
            {!addCouponLoading ? (
              <Text colorSecondary={!couponTrue} medium={couponTrue}>
                {t('common:text_apply')}
              </Text>
            ) : (
              <ActivityIndicator size="small" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemeConsumer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: MIN_HEIGHT,
    borderWidth: 1,
    borderRadius: borderRadius.base,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewInput: {
    flex: 1,
    height: '100%',
    marginRight: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginLeft: margin.small + 1,
  },
  input: {
    height: '100%',
    flex: 1,
    paddingHorizontal: padding.large - 2,
  },
  viewButton: {
    paddingHorizontal: padding.large - 1,
    height: '100%',
    justifyContent: 'center',
  },
});
const mapStateToProps = state => {
  return {
    images: listImageSelector(state),
    addCouponLoading: couponsAddLoadingSelector(state),
  };
};

export default connect(mapStateToProps)(InputCoupon);
