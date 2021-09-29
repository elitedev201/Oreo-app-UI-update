import React from 'react';

import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {Header, ThemedView} from 'src/components';
import {IconHeader, TextHeader, CartIcon} from 'src/containers/HeaderComponent';
import LastestBlog, {LastestBlogLoading} from './containers/LastestBlog';
import ItemBlog from './containers/ItemBlog';
import ItemBlogLoading from './containers/ItemBlogLoading';

import {getBlogs} from 'src/modules/blog/service';
import {getSiteConfig, languageSelector} from 'src/modules/common/selectors';

import {padding, margin} from 'src/components/config/spacing';
import {prepareBlogItem} from 'src/utils/blog';

class BlogList extends React.Component {
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
      const {page} = this.state;
      const query = {
        page,
        per_page: 10,
      };
      // eslint-disable-next-line no-undef
      this.abortController = new AbortController();
      const data = await getBlogs(query, {
        signal: this.abortController.signal,
      });
      if (data.length <= 10 && data.length > 0) {
        const list = data.map(v => prepareBlogItem(v));
        this.setState(prevState => ({
          data: page === 1 ? Array.from(list) : [...prevState.data, ...list],
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
      return null;
    }

    return (
      <View style={styles.footerFlatlist}>
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

  render() {
    const {siteConfig, t} = this.props;
    const {data} = this.state;
    const dataSwiper = data.filter((item, index) => index < 3);
    const dataFlatlist = data.filter((item, index) => index >= 3);
    const dataLoading = new Array(3).fill(0);

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_blogs')} />}
          rightComponent={<CartIcon />}
        />
        {!this.state.loading ? (
          <FlatList
            data={dataFlatlist}
            keyExtractor={item => `${item.id}`}
            renderItem={({item, index}) => (
              <ItemBlog
                tz={siteConfig.get('timezone_string')}
                item={item}
                style={[
                  styles.item,
                  index === 0 && styles.itemFirst,
                  index === dataFlatlist.length - 1 && styles.itemLast,
                ]}
              />
            )}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            ListHeaderComponent={<LastestBlog data={dataSwiper} />}
            ListFooterComponent={this.renderFooter()}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        ) : (
          <FlatList
            data={dataLoading}
            keyExtractor={(_, index) => `${index}`}
            renderItem={({item, index}) => (
              <ItemBlogLoading
                height={120}
                style={[
                  styles.item,
                  index === 0 && styles.itemFirst,
                  index === dataLoading.length - 1 && styles.itemLast,
                ]}
              />
            )}
            ListHeaderComponent={<LastestBlogLoading count={3} />}
          />
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingTop: padding.big,
    marginHorizontal: margin.large,
    borderTopWidth: 1,
  },
  itemFirst: {
    borderTopWidth: 1,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  viewLoading: {
    marginVertical: margin.large,
  },
  footerFlatlist: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    language: languageSelector(state),
    siteConfig: getSiteConfig(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(BlogList));
