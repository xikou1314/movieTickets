import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text, Alert, TouchableOpacity, ListView, Button, Navigator
} from 'react-native';
import config from '../config/index';
import Booking from '../container/booking';

export default class Arrange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      data:[]
    };
    this.getArrange =  this.getArrange.bind(this);
    this.jumpToBooking =  this.jumpToBooking.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  getArrange(){
    var date=new Date(this.props.date);
    console.log(this.props.date);
    fetch(config.baseUrl+'/web/searchArrange?filmId='+this.props.filmId+'&date=?'+date,{
      method: 'get',
    }).then((response) => response.json())
      .then((responseData) => {
        if(responseData.code==0)
        {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.data),
            data:responseData.data
          })
        }


      }).catch(err=>{
    });
  }
  jumpToBooking(filmDetail,arrange){
    var data={
      filmDetail,
      arrange
    }
    this.props.navigator.push({
      id: 'Booking',
      passProps: {data:data},
      component: Booking,
      sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump
    });
  }
  componentDidMount(){
    this.getArrange();

  }
  renderItem(item){
      return <View style={styles.item}>
                <View style={styles.time}>
                <Text style={styles.title}>{item.start.slice(0,-3)}</Text>
                <Text>{item.end.slice(0,-3)}散场</Text>
                </View>
                <View style={styles.room}>
                <Text>{item.roomName}</Text>
                </View>
                <View style={styles.price}>
                <Text style={styles.number}>{item.price}元</Text>
                </View>
                <View style={styles.buy}>
                  <Button
                    title="购票"
                    color="#3281DD"
                    onPress={(e)=>this.jumpToBooking(this.props.filmDetail,item)}>
                  </Button>
                </View>
              </View>;
  }
  render() {
    if(this.state.data.length>0)
    {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          style={styles.listView}
          enableEmptySections={true}
        />
      );
    }
    else {
      return (
        <View><Text>暂无场次安排</Text></View>
      );
    }

  }
}


const styles = StyleSheet.create({
    item: {
      flex:1,
      flexDirection:'row',
      justifyContent:'space-between',
      height:60,
      marginTop: 4,
      borderBottomWidth:1,
      borderBottomColor: '#ccc'
    },
    time: {
      justifyContent: 'center',
      alignItems:'center',
      paddingLeft:10,
      paddingRight:10
    },
    room: {
      justifyContent: 'center',
      alignItems:'center',
      paddingLeft:10,
      paddingRight:10

    },
    price: {
      justifyContent: 'center',
      alignItems:'center',
      paddingLeft:10,
      paddingRight:10,
    },
    title: {
      fontSize: 18,
      color: '#000'
    },
    number: {
      color:'red'
    },
    buy: {
      justifyContent: 'center',
      paddingLeft:20,
      paddingRight:20,
      marginRight:10

    }
});