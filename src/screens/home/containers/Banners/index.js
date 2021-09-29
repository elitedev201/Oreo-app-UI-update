import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

import {StyleSheet, Dimensions} from 'react-native';
import Container from 'src/containers/Container';
import Heading from 'src/containers/Heading';
import Gird from './Gird';
import Scroll from './Scroll';
import Empty from './Empty';

import {languageSelector} from 'src/modules/common/selectors';

import {padding} from 'src/components/config/spacing';

import {colBanner, typeViewBanner} from './config';

import action from 'src/utils/action';

const {width} = Dimensions.get('window');

const initHeader = {
  style: {},
};

class Banners extends React.Component {
  render() {
    const {layout, fields, widthComponent, language, t} = this.props;
    if (
      !fields ||
      typeof fields !== 'object' ||
      Object.keys(fields).length < 1
    ) {
      return null;
    }
    const heading = fields.text_heading ? fields.text_heading : initHeader;
    const valueBox = fields.boxed;

    const widthValue =
      fields.width && parseInt(fields.width, 10)
        ? parseInt(fields.width, 10)
        : 370;
    const heightValue =
      fields.height && parseInt(fields.height, 10)
        ? parseInt(fields.height, 10)
        : 395;
    const radius =
      fields.radius && parseInt(fields.radius, 10)
        ? parseInt(fields.radius, 10)
        : 0;
    const pad =
      fields.pad && parseInt(fields.pad, 10) ? parseInt(fields.pad, 10) : 0;

    const images = fields.images || [];

    const widthView = valueBox
      ? widthComponent - 2 * padding.large
      : widthComponent;

    const headingDisable = !fields.boxed ? 'all' : 'none';
    const contentDisable = !fields.boxed
      ? 'all'
      : typeViewBanner[layout] === 'scroll'
      ? 'right'
      : 'none';

    const Component = typeViewBanner[layout] === 'scroll' ? Scroll : Gird;

    return (
      <>
        {fields.disable_heading && (
          <Container disable={headingDisable}>
            <Heading
              title={
                heading.text && heading.text[language]
                  ? heading.text[language]
                  : t('common:text_blogs')
              }
              style={heading.style}
              containerStyle={styles.header}
            />
          </Container>
        )}
        <Container disable={contentDisable}>
          {images.length < 1 ? (
            <Empty
              widthView={widthView}
              width={widthValue}
              height={heightValue}
              radius={radius}
            />
          ) : (
            <Component
              images={images}
              col={colBanner(layout, images.length)}
              widthImage={widthValue}
              heightImage={heightValue}
              widthView={widthView}
              radius={radius}
              box={valueBox}
              pad={pad}
              clickBanner={data => action(data)}
              language={language}
            />
          )}
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
  },
});

const mapStateToProps = state => ({
  language: languageSelector(state),
});

Banners.defaultProps = {
  widthComponent: width,
};

export default compose(withTranslation(), connect(mapStateToProps))(Banners);
