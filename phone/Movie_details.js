'use strict';
import React,{
  Component
} from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  BackAndroid,
  Text,
  Image,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import config from './config/index';
import moment from 'moment';
import ScrollableTabView,{ ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Arrange from './component/arrange';
class Movie_WebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        filmDetail:{}
    };
  }

  componentDidMount() {
      BackAndroid.addEventListener('hardwareBackPress', this._back.bind(this));
      this.getFilmDetail();
  }
    getFilmDetail() {
        fetch(config.baseUrl+'/web/filmDetail?filmId='+this.props.data.filmId,{
            method: 'get'
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.code == 1)
                {
                    this.setState({
                        filmDetail:responseData.data
                    });
                }

            }).catch(err=>{

        });
    }
  _back() {
        if (this.props.navigator) {
            this.props.navigator.pop();
            return true;
        }
        return false;
    }

  getArrange(){
    var items=[];
    var today = new Date();
    today.setDate(today.getDate()-1);
    for(var i=0;i<7;i++)
    {
      var date=moment(today.setDate(today.getDate()+1));
      items.push(<Arrange filmDetail={this.state.filmDetail} date={date.format("YYYY-MM-DD")} navigator={this.props.navigator} key={"arrange"+i} tabLabel={date.format('MM-DD')} filmId={this.state.filmDetail.filmId}  />);
    }
    return items;
  }
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.box}>
              <View style={styles.infoContainer}>
                  <Text style={styles.h1}>{this.state.filmDetail.filmName}</Text>
                  <Text style={styles.text}>{this.state.filmDetail.englishName}</Text>
                  <Text style={styles.text}>{
                    this.state.filmDetail.class?this.state.filmDetail.class.map(value=>{
                      return value.className+" ";
                    }):""
                  }</Text>
                  <Text style={styles.text}>{
                    this.state.filmDetail.area?this.state.filmDetail.area.map(value=>{
                      return value.areaName+" ";
                    }): ""
                  }
                  /
                    {
                      this.state.filmDetail.filmTime||""
                    }</Text>
                  <Text style={styles.text}>{
                    this.state.filmDetail.onTime?moment(this.state.filmDetail.onTime).format('YYYY-MM-DD'):""
                  }在中国大陆上映</Text>
              </View>
              <View style={styles.imageContainer}>
                  <Image style={styles.img} source={this.state.filmDetail.url?{uri:(config.baseUrl+this.state.filmDetail.url)}:require('./assets/img/user.png')}></Image>
              </View>
          </View>
        {
          this.state.filmDetail.filmId?<ScrollableTabView renderTabBar={() => <ScrollableTabBar/>}>
            {this.getArrange()}
          </ScrollableTabView>:<Text>暂无数据</Text>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  box: {
      height: 200,
      backgroundColor: '#FEAE37',
      flexDirection: 'row',
      marginBottom: 4
  },
  imageContainer: {
      position:'relative',
      top: 30,
      width: 130,
      height: 170,
  },
  img: {
      width: 130,
      height: 170,
  },
  infoContainer: {
      marginTop: 30,
      marginLeft:30,
      marginRight:30
  },
  h1: {
    color: '#fff',
    fontSize: 18
  },
  text: {
    fontSize: 12,
    color: '#f2f2f2',
    marginTop: 4
  }
});

export default Movie_WebView;
