import React from 'react';
import {connect} from 'react-redux';
import compact from 'lodash/compact';
import {withTranslation} from 'react-i18next';
import {View, ActivityIndicator, StyleSheet, FlatList} from 'react-native';
import {ThemedView, Header} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import {ItemVendor, ItemVendorLoading} from 'src/containers/vendor';

import {getVendors} from 'src/modules/vendor/service';
import {fetchVendorDetailSuccess} from 'src/modules/vendor/actions';
import {margin} from 'src/components/config/spacing';
import {mainStack} from 'src/config/navigator';

class Stores extends React.Component {
  state = {
    data: [],
    page: 1,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchData = async () => {
    try {
      // const {language} = this.props;
      const {page} = this.state;
      const query = {
        page,
        per_page: 10,
        // lang: language
      };
      // eslint-disable-next-line no-undef
      this.abortController = new AbortController();
      const data = await getVendors(query, {
        signal: this.abortController.signal,
      });
      if (data.length <= 10 && data.length > 0) {
        const dataCompact = compact(data);
        this.setState(prevState => ({
          data:
            page === 1
              ? Array.from(dataCompact)
              : [...prevState.data, ...dataCompact],
          loading: false,
          loadingMore: data.length === 10,
          refreshing: false,
        }));
      } else {
        this.setState({
          loadingMore: false,
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        error,
        loading: false,
        loadingMore: false,
      });
    }
  };

  handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        (prevState, nextProps) => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchData();
        },
      );
    }
  };

  renderFooter = () => {
    if (!this.state.loadingMore) {
      return <View style={styles.footer} />;
    }

    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchData();
      },
    );
  };
  goStoreDetail = data => {
    const {saveVendor, navigation} = this.props;
    saveVendor(data);
    navigation.navigate(mainStack.store_detail);
  };

  render() {
    const {t} = this.props;
    const {data, loading, refreshing} = this.state;
    const dataLoading = new Array(6).fill(0);
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_stores')} />}
        />
        {!loading ? (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <ItemVendor
                store={item}
                style={styles.item}
                onPress={() => this.goStoreDetail(item)}
              />
            )}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            ListFooterComponent={this.renderFooter()}
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
          />
        ) : (
          <FlatList
            data={dataLoading}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            renderItem={_ => <ItemVendorLoading style={styles.item} />}
          />
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: margin.large,
    marginBottom: margin.small,
  },
  viewLoading: {
    marginVertical: margin.large,
  },
  footer: {
    marginBottom: margin.large,
  },
  footerLoading: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});
const mapDispatchToProps = {
  saveVendor: fetchVendorDetailSuccess,
};

export default connect(null, mapDispatchToProps)(withTranslation()(Stores));
