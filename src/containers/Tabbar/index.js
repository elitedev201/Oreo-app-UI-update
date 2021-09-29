import React from 'react';

import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text, SafeAreaView, ThemeConsumer} from 'src/components';
import IconTabbar from './IconTabbar';

import {homeTabs} from 'src/config/navigator';

import {configsSelector} from 'src/modules/common/selectors';

import {grey5} from 'src/components/config/colors';
import {sizes} from 'src/components/config/fonts';
import {padding} from 'src/components/config/spacing';

const Tabbar = props => {
  const {configs, navigation, state, t} = props;
  const data = [
    {
      iconName: 'home',
      name: t('common:text_home'),
      router: homeTabs.home_drawer,
      isShow: true,
    },
    {
      iconName: 'search',
      name: t('common:text_shop'),
      router: homeTabs.shop,
      isShow: true,
    },
    {
      iconName: 'heart',
      name: t('common:text_wishList'),
      nameData: 'wishList',
      router: homeTabs.wish_list,
      isShow: configs.get('toggleWishlist'),
    },
    {
      iconName: 'shopping-bag',
      name: t('common:text_cart'),
      nameData: 'cart',
      router: homeTabs.cart,
      isShow: configs.get('toggleCheckout'),
    },
    {
      iconName: 'user',
      name: t('common:text_me'),
      router: homeTabs.me,
      iconProps: {
        size: 23,
      },
      isShow: true,
    },
  ];

  const visit = state.index;

  return (
    <ThemeConsumer>
      {({theme}) => (
        <SafeAreaView
          forceInset={{bottom: 'always'}}
          style={[styles.container, theme.TabNavigator.tabStyle]}>
          {data.map((tab, index) =>
            tab.isShow ? (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => navigation.navigate(tab.router)}>
                <IconTabbar
                  name={tab.iconName}
                  color={visit === index ? theme.colors.primary : grey5}
                  nameData={tab.nameData}
                  {...tab.iconProps}
                />
                <Text
                  medium
                  style={[
                    styles.text,
                    {
                      color: visit === index ? theme.colors.primary : grey5,
                    },
                  ]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ) : null,
          )}
        </SafeAreaView>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: padding.small - 1,
  },
  text: {
    fontSize: sizes.h6 - 2,
    lineHeight: 15,
    marginTop: 5,
  },
});

const mapStateToProps = state => {
  return {
    configs: configsSelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(Tabbar));
