import React from 'react';

import {connect} from 'react-redux';
import {StatusBar} from 'react-native';
import {ThemedView} from 'src/components';
import GetStartSwiper from 'src/containers/GetStartSwiper';
import GetStartVideo from 'src/containers/GetStartVideo';

import {closeGettingStarted} from 'src/modules/common/actions';

const ENABLE_VIDEO = false;

class GetStartScreen extends React.Component {
  handleGettingStarted = () => {
    const {handleCloseGettingStarted} = this.props;
    handleCloseGettingStarted();
  };

  render() {
    return (
      <ThemedView isFullView>
        <StatusBar hidden />
        {ENABLE_VIDEO ? (
          <GetStartVideo handleGettingStarted={this.handleGettingStarted} />
        ) : (
          <GetStartSwiper handleGettingStarted={this.handleGettingStarted} />
        )}
      </ThemedView>
    );
  }
}

const mapDispatchToProps = {
  handleCloseGettingStarted: closeGettingStarted,
};

export default connect(null, mapDispatchToProps)(GetStartScreen);
