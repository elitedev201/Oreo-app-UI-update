import React from 'react';

import {connect} from 'react-redux';
import moment from 'moment';
import {DrawerActions} from '@react-navigation/native';

import {ScrollView, View, Dimensions} from 'react-native';

import {ThemedView, Header} from 'src/components';
import {IconHeader, Logo, CartIcon} from 'src/containers/HeaderComponent';
import ModalHomePopup from 'src/containers/ModalHomePopup';

import {fetchCategories} from 'src/modules/category/actions';
import {categorySelector} from 'src/modules/category/selectors';
import {fetchSettingSuccess} from 'src/modules/common/actions';
import {
  dataConfigSelector,
  toggleSidebarSelector,
  expireConfigSelector,
} from 'src/modules/common/selectors';

import {fetchSetting} from 'src/modules/common/service';

// Containers
import Slideshow from './home/containers/Slideshow';
import CategoryList from './home/containers/CategoryList';
import ProductList from './home/containers/ProductList';
import ProductCategory from './home/containers/ProductCategory';
import Banners from './home/containers/Banners';
import TextInfo from './home/containers/TextInfo';
import CountDown from './home/containers/CountDown';
import BlogList from './home/containers/BlogList';
import Testimonials from './home/containers/Testimonials';
import Button from './home/containers/Button';
import Vendors from './home/containers/Vendors';
import Search from './home/containers/Search';
import Divider from './home/containers/Divider';

const {width} = Dimensions.get('window');

const containers = {
  slideshow: Slideshow,
  categories: CategoryList,
  products: ProductList,
  productcategory: ProductCategory,
  banners: Banners,
  text: TextInfo,
  countdown: CountDown,
  blogs: BlogList,
  testimonials: Testimonials,
  button: Button,
  vendors: Vendors,
  search: Search,
  divider: Divider,
};

const widthComponent = spacing => {
  if (!spacing) {
    return width;
  }
  const marginLeft =
    spacing.marginLeft && parseInt(spacing.marginLeft, 10)
      ? parseInt(spacing.marginLeft, 10)
      : 0;
  const marginRight =
    spacing.marginRight && parseInt(spacing.marginRight, 10)
      ? parseInt(spacing.marginRight, 10)
      : 0;
  const paddingLeft =
    spacing.paddingLeft && parseInt(spacing.paddingLeft, 10)
      ? parseInt(spacing.paddingLeft, 10)
      : 0;
  const paddingRight =
    spacing.paddingRight && parseInt(spacing.paddingRight, 10)
      ? parseInt(spacing.paddingRight, 10)
      : 0;
  return width - marginLeft - marginRight - paddingLeft - paddingRight;
};

class HomeScreen extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    this.getConfig();
    dispatch(fetchCategories());
  }

  getConfig = async () => {
    try {
      const {dispatch} = this.props;
      // Fetch setting
      let settings = await fetchSetting();
      const {configs, templates, ...rest} = settings;
      dispatch(
        fetchSettingSuccess({
          settings: rest,
          configs: configs,
          templates: templates,
        }),
      );
    } catch (e) {
      console.log('e');
    }
  };

  renderContainer(config) {
    const Container = containers[config.type];
    if (!Container) {
      return null;
    }
    return (
      <View key={config.id} style={config.spacing && config.spacing}>
        <Container
          {...config}
          widthComponent={widthComponent(config.spacing)}
        />
      </View>
    );
  }

  render() {
    // const { category, product } = this.props;
    const {config, toggleSidebar, navigation} = this.props;

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={
            toggleSidebar ? (
              <IconHeader
                name="align-left"
                size={22}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              />
            ) : null
          }
          centerComponent={<Logo />}
          rightComponent={<CartIcon />}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {config.map(data => this.renderContainer(data))}
        </ScrollView>
        <ModalHomePopup />
      </ThemedView>
    );
  }
}

const mapStateToProps = state => {
  return {
    config: dataConfigSelector(state),
    toggleSidebar: toggleSidebarSelector(state),
    expireConfig: expireConfigSelector(state),
    expireCategory: categorySelector(state).expire,
  };
};

export default connect(mapStateToProps)(HomeScreen);
