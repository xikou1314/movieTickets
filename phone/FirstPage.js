
import React, {
    Component,
} from 'react';

import {
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import MovieTabBar from './MovieTabBar';
import Movie_details from './Movie_details';
import Coming_Soon from './Coming_Soon';
import config from './config/index';
import Me from './me';

var REQUEST_URL = 'https://api.douban.com/v2/movie/in_theaters';

class FirstPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNames: ['正在热映', '查询','我'],
      tabIconNames: ['ios-flame', 'md-bulb','ios-person'],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.push = this._push.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(config.baseUrl+'/web/hotfilm')
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.data),
            loaded: true,
          });
        });
  }

  render() {
    let tabNames = this.state.tabNames;
    let tabIconNames = this.state.tabIconNames;
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
        <ScrollableTabView
          renderTabBar={() => <MovieTabBar tabNames={tabNames} tabIconNames={tabIconNames}/>}
          tabBarPosition='bottom'>

          <View style={styles.container} tabLabel='key1'>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderMovie.bind(this)}
              style={styles.listView}
            />
          </View>

          <Coming_Soon navigator={this.props.navigator}  style={styles.container} tabLabel='key2'/>
          <Me navigator={this.props.navigator} style={styles.container} tabLabel='key3'/>
        </ScrollableTabView>
    );
  }

  renderLoadingView() {
    return (
        <View style={styles.loading}>
          <Image
            source={require('./assets/img/starting.gif')}
            style={{height: 300,width: 400}}
          />
        </View>
    );
  }

  renderMovie(movie) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {this._push(movie)}}>
        <View style={styles.container}>
          <Image
              source={{uri:config.baseUrl+movie.url}}
              style={styles.small}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{movie.filmName}</Text>
            <Text style={styles.originaltitle}>{movie.englishName}</Text>
            <Text style={styles.introduce}>{"上映时间："+movie.onTime.slice(0,10)}</Text>
            <Text style={styles.introduce}>{"演员："+movie.performers}</Text>
            <Text style={styles.introduce}>{"导演："+movie.directors}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

 _push(movie) {
  this.props.navigator.push({
    id: 'Movie_details',
    passProps: {data:movie},
    component: Movie_details,
    sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderTopWidth: 0.5,
    borderTopColor: '#E8E8E8'
  },
  loading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE439'
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 7,
    textAlign: 'left',
  },
  originaltitle: {
    fontSize: 13,
    fontStyle:'italic',
    marginTop: -2,
    marginLeft: 7,
    marginBottom: 4,
  },
  introduce: {
    marginLeft: 7,
    textAlign: 'left',
  },
  small: {
    margin: 7,
    marginLeft: 13,
    width: 64,
    height: 103,
  },
  listView: {
    backgroundColor: '#F5F5F5',
  },
});

export default FirstPage;
