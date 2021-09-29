// @flow

import React from 'react';

import {connect} from 'react-redux';
import {fetchSettingSuccess} from 'src/modules/common/actions';
import {isLogin} from 'src/modules/auth/actions';
import {isLoginSelector} from 'src/modules/auth/selectors';
import {fetchCategories} from 'src/modules/category/actions';
import {fetchSetting} from 'src/modules/common/service';

import SplashScreen from 'react-native-splash-screen';

type Props = {
  initSetting: Function,
};

class LoadingScreen extends React.Component<Props> {
  componentDidMount() {
    this.bootstrapAsync();
  }

  /**
   * Init data
   * @returns {Promise<void>}
   */
  bootstrapAsync = async () => {
    try {
      const {initSetting, handleFetchCategories, isLoginBool, isLoginFc} =
        this.props;

      // Fetch setting
      let settings = await fetchSetting();
      // const configs = await fetchConfig();
      // const templates = await fetchTemplate();

      const {configs, templates, ...rest} = settings;

      // Check user token
      if (isLoginBool) {
        isLoginFc();
      }

      initSetting({
        settings: rest,
        configs: configs,
        templates: templates,
      });
      // Fetch categories
      handleFetchCategories();
      // const router = isGettingStart ? rootSwitch.start : configs.requireLogin && !isLogin ? rootSwitch.auth : rootSwitch.main;
      // navigation.navigate(router);
      SplashScreen.hide();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {
    isLoginBool: isLoginSelector(state),
  };
};

const mapDispatchToProps = {
  initSetting: fetchSettingSuccess,
  handleFetchCategories: fetchCategories,
  isLoginFc: isLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
