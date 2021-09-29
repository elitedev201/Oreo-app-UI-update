import React from 'react';

import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import firebase from '@react-native-firebase/app';

import {
  StyleSheet,
  ScrollView,
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Header,
  Loading,
  Text,
  ThemedView,
  Button,
  ThemeConsumer,
} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import InputMobile from 'src/containers/input/InputMobile';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import ModalVerify from './containers/ModalVerify';
import SocialMethods from './containers/SocialMethods';

import {signUpWithEmail} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';
import {checkPhoneNumber} from 'src/modules/auth/service';

import {authStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';
import {changeColor} from 'src/utils/text-html';
import {showMessage} from 'react-native-flash-message';
import {INITIAL_COUNTRY} from 'src/config/config-input-phone-number';
import {formatPhoneWithCountryCode} from 'src/utils/phone-formatter';

class RegisterScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {
        first_name: '',
        last_name: '',
        name: '',
        email: '',
        password: '',
        phone_number: '',
        country_no: '',
        country_code: '',
        subscribe: false,
      },
      user: null,
      confirmResult: null,
      visibleModal: false,
      loading: false,
      error: {
        message: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const {data} = this.state;
        this.setState({
          user,
          data: {...data, phone_number: user.phoneNumber},
        });
      }
      if (this.state.confirmResult && Platform.OS === 'android') {
        this.register();
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  changeData = value => {
    this.setState({
      data: {
        ...this.state.data,
        ...value,
      },
    });
  };

  register = () => {
    const {enablePhoneNumber} = this.props;
    const {data} = this.state;
    let payload = data;
    const {country_code} = data;
    if (enablePhoneNumber) {
      const currentUser = firebase.auth().currentUser;

      const user_phone_number =
        currentUser?._user?.phoneNumber ??
        formatPhoneWithCountryCode(data.phone_number, country_code);
      payload = Object.assign(data, {
        enable_phone_number: true,
        digits_phone: user_phone_number,
        digt_countrycode: data.country_no,
        digits_phone_no: data.phone_number,
      });
    }
    this.setState({loading: false});
    this.props.dispatch(signUpWithEmail(payload));
  };

  /**
   * Handle User register
   */
  handleRegister = async () => {
    this.setState({
      loading: true,
    });
    try {
      const {enablePhoneNumber} = this.props;
      const {data, user} = this.state;
      const {phone_number, country_code} = data;
      // Register with phone number
      if (enablePhoneNumber) {
        // Get user phone number
        const user_phone_number = formatPhoneWithCountryCode(
          phone_number,
          country_code,
        );
        await checkPhoneNumber({
          digits_phone: user_phone_number,
          type: 'register',
        });
        if (!user) {
          // Send Verify token
          const confirmResult = await firebase
            .auth()
            .signInWithPhoneNumber(user_phone_number);
          this.setState({
            confirmResult,
          });
        } else {
          this.register();
        }
      } else {
        this.register();
      }
    } catch (e) {
      showMessage({
        message: e.message,
        type: 'danger',
      });
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {
      navigation,
      auth: {pending},
      enablePhoneNumber,
      t,
    } = this.props;
    const {
      data: {
        email,
        first_name,
        last_name,
        name,
        phone_number,
        country_no,
        password,
        subscribe,
      },
      error: {message, errors},
      visibleModal,
      loading,
      user,
      confirmResult,
    } = this.state;
    const visible = visibleModal || !!(!user && confirmResult);
    return (
      <ThemeConsumer>
        {({theme}) => (
          <ThemedView isFullView>
            <Loading visible={pending} />
            <Header
              leftComponent={<IconHeader />}
              centerComponent={<TextHeader title={t('common:text_register')} />}
            />
            <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
              <ScrollView>
                <Container>
                  {message ? (
                    <TextHtml
                      value={message}
                      style={changeColor(theme.colors.error)}
                    />
                  ) : null}
                  <Input
                    label={t('auth:text_input_first_name')}
                    value={first_name}
                    onChangeText={value => this.changeData({first_name: value})}
                    error={errors && errors.first_name}
                  />
                  <Input
                    label={t('auth:text_input_last_name')}
                    value={last_name}
                    onChangeText={value => this.changeData({last_name: value})}
                    error={errors && errors.last_name}
                  />
                  <Input
                    label={t('auth:text_input_user')}
                    value={name}
                    onChangeText={value => this.changeData({name: value})}
                    error={errors && errors.name}
                  />
                  {enablePhoneNumber ? (
                    <InputMobile
                      value={phone_number}
                      initialCountry={INITIAL_COUNTRY}
                      onChangePhoneNumber={({value, code, isoCode}) =>
                        this.changeData({
                          phone_number: value,
                          country_no: code,
                          country_code: isoCode,
                        })
                      }
                      error={errors && errors.phone_number}
                    />
                  ) : null}
                  <Input
                    label={t('auth:text_input_email')}
                    value={email}
                    onChangeText={value => this.changeData({email: value})}
                    error={errors && errors.email}
                  />
                  <Input
                    label={t('auth:text_input_password')}
                    value={password}
                    secureTextEntry
                    onChangeText={value => this.changeData({password: value})}
                    error={errors && errors.password}
                  />
                  <View style={styles.viewSwitch}>
                    <Text style={styles.textSwitch} colorSecondary>
                      {t('auth:text_agree_register')}
                    </Text>
                    <Switch
                      value={subscribe}
                      onValueChange={value =>
                        this.changeData({subscribe: value})
                      }
                    />
                  </View>
                  <Button
                    title={t('auth:text_register')}
                    onPress={this.handleRegister}
                    loading={loading || pending}
                  />
                  <SocialMethods style={styles.viewAccount} />
                  <Text
                    medium
                    style={styles.textHaveAccount}
                    onPress={() => navigation.navigate(authStack.login)}>
                    {t('auth:text_already_account')}
                  </Text>
                  <ModalVerify
                    visible={visible}
                    type={'register'}
                    phone={
                      phone_number.includes(country_no)
                        ? phone_number
                        : country_no + phone_number
                    }
                    confirmation={confirmResult}
                    handleVerify={this.register}
                    setModalVisible={value =>
                      this.setState({
                        visibleModal: value,
                        loading: false,
                        confirmResult: null,
                      })
                    }
                  />
                </Container>
              </ScrollView>
            </KeyboardAvoidingView>
          </ThemedView>
        )}
      </ThemeConsumer>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  viewSwitch: {
    marginVertical: margin.big,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textSwitch: {
    flex: 1,
    lineHeight: lineHeights.h4,
    marginRight: margin.large,
  },
  viewAccount: {
    marginVertical: margin.big,
  },
  textHaveAccount: {
    paddingVertical: padding.small,
    marginTop: margin.base,
    marginBottom: margin.big,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(withTranslation()(RegisterScreen));
