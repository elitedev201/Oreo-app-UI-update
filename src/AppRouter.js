/**
 *
 * App router
 *
 *
 * App Name:          rn_oreo
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.1.0
 * Author:            Rnlab.io
 *
 * @since             1.0.0
 *
 * @format
 * @flow
 */

import React from 'react';

import './config-i18n';

import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {compose} from 'redux';

import FlashMessage from 'react-native-flash-message';

import {darkColors, getThemeLight} from './components/config/colors';

import {ThemeProvider} from 'src/components';
import Router from './navigation/root-switch';
import Unconnected from './containers/Unconnected';

import {
  themeSelector,
  colorsSelector,
  languageSelector,
} from './modules/common/selectors';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
      isConnected: true,
    };
    const {i18n, language} = props;
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }

  componentDidMount() {
    NetInfo.addEventListener(state => {
      const {isCheck} = this.state;
      const {isConnected} = state;
      if (!isConnected) {
        this.setState({
          isConnected: false,
        });
      }
      if (isCheck && isConnected) {
        this.setState({
          isConnected: true,
          isCheck: false,
        });
      }
    });
  }

  checkInternet = () => {
    this.setState({
      isCheck: true,
    });
  };

  componentDidUpdate(prevProps) {
    const {i18n, language} = this.props;
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }

  render() {
    const {theme, colors} = this.props;
    const {isConnected} = this.state;

    const themeColor = theme === 'light' ? getThemeLight(colors) : darkColors;
    const barStyle = theme === 'light' ? 'dark-content' : 'light-content';

    return (
      <ThemeProvider theme={themeColor}>
        <StatusBar
          translucent
          barStyle={barStyle}
          backgroundColor="transparent"
        />
        {!isConnected ? (
          <Unconnected clickTry={this.checkInternet} />
        ) : (
          <Router />
        )}
        <FlashMessage position="top" />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: languageSelector(state),
    theme: themeSelector(state),
    colors: colorsSelector(state),
  };
};

export default compose(withTranslation(), connect(mapStateToProps))(AppRouter);
