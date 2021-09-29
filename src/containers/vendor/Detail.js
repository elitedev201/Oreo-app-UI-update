import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, Dimensions, FlatList} from 'react-native';
import ButtonGroup from 'src/containers/ButtonGroup';
import AboutStore from './About';

import ProductStore from 'src/screens/shop/store/ProductStore';
import ReviewsStore from 'src/screens/shop/store/ReviewsStore';
import ContactStore from 'src/screens/shop/store/ContactStore';
import TimeStore from 'src/screens/shop/store/TimeStore';

import {detailVendorSelector} from 'src/modules/vendor/selectors';

import {VENDOR} from 'src/config/development';

import {padding, margin} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');

class StoreDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visitCurrent: 0,
    };
  }
  renderContent = ({item, index}) => {
    const {navigation, vendorDetail, ...props} = this.props;
    const {visitCurrent} = this.state;
    const ContentComponent = item.Component;

    return (
      <View style={styles.tabContent}>
        {index === visitCurrent && ContentComponent ? (
          <ContentComponent
            {...props}
            navigation={navigation}
            store={vendorDetail}
          />
        ) : null}
      </View>
    );
  };

  goTab = index => {
    if (this.flatListPayment) {
      this.flatListPayment.scrollToIndex({animated: false, index});
      this.setState({
        visitCurrent: index,
      });
    }
  };

  render() {
    const {t} = this.props;
    const {visitCurrent} = this.state;

    const dataTab =
      VENDOR === 'wcfm'
        ? [
            {
              name: t('catalog:text_store_detail_product'),
              showNumber: false,
              Component: ProductStore,
            },
            {
              name: t('catalog:text_store_detail_about'),
              showNumber: false,
              Component: AboutStore,
            },
          ]
        : [
            {
              name: t('catalog:text_store_detail_product'),
              showNumber: false,
              Component: ProductStore,
            },
            {
              name: t('catalog:text_store_detail_review'),
              Component: ReviewsStore,
            },
            {
              name: t('catalog:text_store_detail_about'),
              showNumber: false,
              Component: AboutStore,
            },
            {
              name: t('catalog:text_store_detail_time'),
              Component: TimeStore,
            },
            {
              name: t('catalog:text_store_detail_contact'),
              Component: ContactStore,
            },
          ];

    return (
      <>
        <ButtonGroup
          lists={dataTab}
          visit={visitCurrent}
          clickButton={this.goTab}
          containerStyle={styles.headerTab}
          contentContainerStyle={styles.tabScroll}
          pad={36}
        />
        <FlatList
          data={dataTab}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          ref={ref => {
            this.flatListPayment = ref;
          }}
          keyExtractor={item => item.name}
          renderItem={this.renderContent}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    width: width,
  },
  headerTab: {
    paddingLeft: margin.large,
    marginVertical: margin.big,
  },
  tabScroll: {
    paddingRight: padding.large,
  },
});

export default withTranslation()(StoreDetail);
