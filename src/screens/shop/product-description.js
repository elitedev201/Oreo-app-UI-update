import React, {Component} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';

import HTMLView from 'react-native-htmlview';
import WebView from 'react-native-webview';
import {Header, ThemedView, ThemeConsumer} from 'src/components';
import Container from 'src/containers/Container';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';

import fonts, {lineHeights} from 'src/components/config/fonts';
import {ENABLE_WEBVIEW} from 'src/config/product-description';

class ProductDescription extends Component {
  render() {
    const {t, theme, route} = this.props;
    const textStyle = {
      ...fonts.regular,
      ...theme.Text.primary,
      lineHeight: lineHeights.h4,
    };
    const styleHTML = {
      div: textStyle,
      p: textStyle,
    };
    const description = route?.params?.description ?? '';
    const isIframe = description.includes('<iframe');
    const html = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">img {max-width: 100%}</style></head><body>${description}</body></html>`;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader name="x" size={24} />}
          centerComponent={
            <TextHeader title={t('common:text_product_description')} />
          }
        />
        {isIframe || ENABLE_WEBVIEW ? (
          <WebView originWhitelist={['*']} source={{html}} />
        ) : (
          <ScrollView>
            <Container>
              <HTMLView value={description} stylesheet={styleHTML} />
            </Container>
          </ScrollView>
        )}
      </ThemedView>
    );
  }
}

ProductDescription.propTypes = {};

export default function (props) {
  const {t} = useTranslation();
  return (
    <ThemeConsumer>
      {({theme}) => <ProductDescription t={t} theme={theme} {...props} />}
    </ThemeConsumer>
  );
}
