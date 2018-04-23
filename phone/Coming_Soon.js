import React, {
    Component,
} from 'react';

import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator,
  TextInput,
  Button, Alert
} from 'react-native';

import Movie_details from './Movie_details';
import config from "./config";
import DeviceStorage from "./assets/util/DeviceStorage";

var REQUEST_URL = 'https://api.douban.com/v2/movie/coming_soon';

class Coming_Soon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: true,
      value:"你的名字",
      list:[]
    }
    ;
    // this.fetchData = this.fetchData.bind(this);
    // this.push = this._push.bind(this);
  }

  componentDidMount() {
    // this.fetchData();
  }

  search=()=>{
    this.setState({
      loaded:false
    });
    fetch(config.baseUrl+'/web/searchFilm?filmName='+this.state.value,{
      method: 'get'
    }).then((response) => response.json())
      .then((responseData) => {
        if(responseData.code==1)
        {
          this.setState({
            dataSource:this.state.dataSource.cloneWithRows(responseData.data),
            list:responseData.data,
            loaded:true
          });

        }
      });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
        <View>
          <View
            style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              marginTop:20
            }}>
          <TextInput
            placeholder={"电影名称"}
            value={this.state.value}
            onChangeText={(text) => this.setState({value:text})}
            style={{
              borderWidth:1,
              borderColor:'#ccc',
              marginLeft:10,
              marginRight:10,
              borderRadius:6,
              height:40,
              paddingLeft:4,
              width:300
            }}
            underlineColorAndroid={"transparent"}
          />
          <Button
            title="搜索"
            color="#3281DD"
            onPress={this.search}
          />
          </View>
          {
            this.state.list.length>0?<ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderMovie.bind(this)}
            style={styles.listView}
            />:<Text style={{marginLeft:20,marginTop:10}}>暂无数据</Text>
          }
        </View>
    );
  }

  renderMovie(movie) {
    return (
      <TouchableOpacity style={styles.container} onPress={() => {this._push(movie)}} >
        <View style={styles.container}>
          <Image
            source={{uri:config.baseUrl+movie.url}}
            style={styles.small}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{movie.filmName}</Text>
            <Text style={styles.originaltitle}>{movie.englishName}</Text>
            <Text style={styles.introduce}>{"上映时间："+movie.onTime}</Text>
            <Text style={styles.introduce}>{"演员："+movie.performers}</Text>
            <Text style={styles.introduce}>{"导演："+movie.directors}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <Image
          source={require('./assets/img/loading.gif')}
          style={{height: 32,width: 32}}
        />
      </View>
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
    backgroundColor: '#fff'
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
    marginTop:10
  },
});

export default Coming_Soon;
